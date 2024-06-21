document.addEventListener('DOMContentLoaded', (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const db = firebase.firestore();
            const userId = user.uid;

            // Função para verificar e ajustar valores de um bimestre específico
            function verificarEAtualizarBimestre(bimestreNome, campos) {
                const docRef = db.collection(bimestreNome).doc(userId);
                return docRef.get().then((doc) => {
                    if (doc.exists) {
                        // Documento existe, verificar e atribuir valores numéricos
                        const data = {};
                        campos.forEach(campo => {
                            data[campo] = doc.data()[campo] || "0"; // Mantém "0" se não existir valor
                        });
                        // Atualizar o documento com os valores verificados
                        return docRef.set(data, { merge: true });
                    } else {
                        // Documento não existe, criar com valores padrão ("0")
                        const data = {};
                        campos.forEach(campo => {
                            data[campo] = "0";
                        });
                        return docRef.set(data);
                    }
                }).catch((error) => {
                    console.error(`Erro ao verificar/atualizar bimestre ${bimestreNome}:`, error);
                    return Promise.reject(error);
                });
            }

            // Função para calcular média dos campos com o mesmo prefixo em um bimestre
            function calcularMediaBimestre(bimestreNome, prefixo) {
                const docRef = db.collection(bimestreNome).doc(userId);
                return docRef.get().then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        const campos = Object.keys(data).filter(campo => campo.startsWith(prefixo));
                        let soma = 0;
                        let quantidade = 0;
                        campos.forEach(campo => {
                            const valor = parseFloat(data[campo]);
                            if (!isNaN(valor)) {
                                soma += valor;
                                quantidade++;
                            }
                        });
                        const media = quantidade > 0 ? soma / quantidade : 0;
                        return media;
                    } else {
                        console.log(`Documento ${bimestreNome} não encontrado para o usuário ${userId}`);
                        return 0;
                    }
                }).catch((error) => {
                    console.error(`Erro ao calcular média do prefixo ${prefixo} no bimestre ${bimestreNome}:`, error);
                    return Promise.reject(error);
                });
            }

            // Definição dos campos para cada bimestre
            const bimestres = [
                {
                    nome: "bimestre1",
                    campos: [
                        "artb1n1", "artb1n2",
                        "biob1n1", "biob1n2",
                        "edfb1n1", "edfb1n2",
                        "filb1n1", "filb1n2",
                        "fisb1n1", "fisb1n2",
                        "geob1n1", "geob1n2",
                        "hisb1n1", "hisb1n2",
                        "ingb1n1", "ingb1n2",
                        "matb1n1", "matb1n2",
                        "porb1n1", "porb1n2",
                        "quib1n1", "quib1n2",
                        "eleb1n1", "eleb1n2",
                        "invb1n1", "invb1n2"
                    ]
                },
                {
                    nome: "bimestre2",
                    campos: [
                        "artb2n1", "artb2n2",
                        "biob2n1", "biob2n2",
                        "edfb2n1", "edfb2n2",
                        "filb2n1", "filb2n2",
                        "fisb2n1", "fisb2n2",
                        "geob2n1", "geob2n2",
                        "hisb2n1", "hisb2n2",
                        "ingb2n1", "ingb2n2",
                        "matb2n1", "matb2n2",
                        "porb2n1", "porb2n2",
                        "quib2n1", "quib2n2",
                        "eleb2n1", "eleb2n2",
                        "invb2n1", "invb2n2"
                    ]
                },
                {
                    nome: "bimestre3",
                    campos: [
                        "artb3n1", "artb3n2",
                        "biob3n1", "biob3n2",
                        "edfb3n1", "edfb3n2",
                        "filb3n1", "filb3n2",
                        "fisb3n1", "fisb3n2",
                        "geob3n1", "geob3n2",
                        "hisb3n1", "hisb3n2",
                        "ingb3n1", "ingb3n2",
                        "matb3n1", "matb3n2",
                        "porb3n1", "porb3n2",
                        "quib3n1", "quib3n2",
                        "eleb3n1", "eleb3n2",
                        "invb3n1", "invb3n2"
                    ]
                },
                {
                    nome: "bimestre4",
                    campos: [
                        "artb4n1", "artb4n2",
                        "biob4n1", "biob4n2",
                        "edfb4n1", "edfb4n2",
                        "filb4n1", "filb4n2",
                        "fisb4n1", "fisb4n2",
                        "geob4n1", "geob4n2",
                        "hisb4n1", "hisb4n2",
                        "ingb4n1", "ingb4n2",
                        "matb4n1", "matb4n2",
                        "porb4n1", "porb4n2",
                        "quib4n1", "quib4n2",
                        "eleb4n1", "eleb4n2",
                        "invb4n1", "invb4n2"
                    ]
                }
            ];

            // Definição dos prefixos
            const prefixos = ["art", "bio", "edf", "fil", "fis", "geo", "his", "ing", "mat", "por", "qui", "ele", "inv"];

            // Array de promessas para verificar e atualizar todos os bimestres
            const promisesVerificarAtualizar = bimestres.map(bimestre => {
                return verificarEAtualizarBimestre(bimestre.nome, bimestre.campos);
            });

            // Executa todas as promessas de verificação e atualização em paralelo
            Promise.all(promisesVerificarAtualizar).then(() => {
                console.log("Verificação e atualização de bimestres concluídas com sucesso");

                // Array de promessas para calcular médias de todos os prefixos em todos os bimestres
                const promisesCalcularMedias = [];
                prefixos.forEach(prefixo => {
                    const mediasBimestrais = bimestres.map(bimestre => {
                        return calcularMediaBimestre(bimestre.nome, prefixo);
                    });
                    promisesCalcularMedias.push(Promise.all(mediasBimestrais).then(medias => {
                        const mediaAnual = medias.reduce((acc, media) => acc + media, 0) / medias.length;
                        console.log(`Média anual do prefixo ${prefixo}:`, mediaAnual);
                        // Atualizar a média anual no elemento HTML correspondente ao prefixo
                        const elemento = document.getElementById(prefixo);
                        if (elemento) {
                            if (mediaAnual < 6) {
                                const mediaAnualpor = mediaAnual * 50 / 3;
                                elemento.textContent = mediaAnualpor.toFixed(2) + "%"; // Arredonda para 2 casas decimais
                                elemento.style.width = mediaAnualpor.toFixed(2) + "%";
                                if (mediaAnualpor < 100) {
                                    elemento.style.backgroundColor = "#5ccb5f"
                                }
                                if (mediaAnualpor < 75) {
                                    elemento.style.backgroundColor = "#ffff34"
                                }
                                if (mediaAnualpor < 50) {
                                    elemento.style.backgroundColor = "#ff8000"
                                }
                                if (mediaAnualpor < 25) {
                                    elemento.style.backgroundColor = "#ff0000"
                                }
                            } else {
                                elemento.style.width = "100%";
                                elemento.style.backgroundColor = "#009929";
                                elemento.textContent = "100%";
                                if (mediaAnual == 10) {
                                    elemento.textContent = "⭐⭐⭐⭐⭐";
                                }
                                if (mediaAnual < 10) {
                                    elemento.textContent = "⭐⭐⭐⭐";
                                }
                                if (mediaAnual < 9) {
                                    elemento.textContent = "⭐⭐⭐";
                                }
                                if (mediaAnual < 8) {
                                    elemento.textContent = "⭐⭐";
                                }
                                if (mediaAnual < 7) {
                                    elemento.textContent = "⭐";
                                }
                            }
                        }
                    }));
                });

                // Executa todas as promessas de cálculo de médias em paralelo
                return Promise.all(promisesCalcularMedias);
            }).then(() => {
                console.log("Cálculo de médias anuais concluído com sucesso");
            }).catch((error) => {
                console.error("Erro ao verificar/atualizar bimestres ou calcular médias anuais:", error);
            });

        } else {
            console.log("Nenhum usuário conectado");
        }
    });
});

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

function bimestre1() {
    window.location.href = "bimestre1/index.html";
}

function bimestre2() {
    window.location.href = "bimestre2/index.html";
}

function bimestre3() {
    window.location.href = "bimestre3/index.html";
}

function bimestre4() {
    window.location.href = "bimestre4/index.html";
}

