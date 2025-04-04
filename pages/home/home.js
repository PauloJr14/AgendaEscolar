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
                        "cieb1n1", "cieb1n2",
                        "edfb1n1", "edfb1n2",
                        "filb1n1", "filb1n2",
                        "fisb1n1", "fisb1n2",
                        "geob1n1", "geob1n2",
                        "hisb1n1", "hisb1n2",
                        "ingb1n1", "ingb1n2",
                        "matb1n1", "matb1n2",
                        "porb1n1", "porb1n2",
                        "quib1n1", "quib1n2",
                        "socb1n1", "socb1n2"
                    ]
                },
                {
                    nome: "bimestre2",
                    campos: [
                        "artb2n1", "artb2n2",
                        "biob2n1", "biob2n2",
                        "cieb2n1", "cieb2n2",
                        "edfb2n1", "edfb2n2",
                        "filb2n1", "filb2n2",
                        "fisb2n1", "fisb2n2",
                        "geob2n1", "geob2n2",
                        "hisb2n1", "hisb2n2",
                        "ingb2n1", "ingb2n2",
                        "matb2n1", "matb2n2",
                        "porb2n1", "porb2n2",
                        "quib2n1", "quib2n2",
                        "socb2n1", "socb2n2"
                    ]
                },
                {
                    nome: "bimestre3",
                    campos: [
                        "artb3n1", "artb3n2",
                        "biob3n1", "biob3n2",
                        "cieb3n1", "cieb3n2",
                        "edfb3n1", "edfb3n2",
                        "filb3n1", "filb3n2",
                        "fisb3n1", "fisb3n2",
                        "geob3n1", "geob3n2",
                        "hisb3n1", "hisb3n2",
                        "ingb3n1", "ingb3n2",
                        "matb3n1", "matb3n2",
                        "porb3n1", "porb3n2",
                        "quib3n1", "quib3n2",
                        "socb3n1", "socb3n2"
                    ]
                }
            ];

            // Definição dos prefixos
            const prefixos = ["art", "bio", "cie", "edf", "fil", "fis", "geo", "his", "ing", "mat", "por", "qui", "soc"];

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
                                if (elemento.id == "bio" & mediaAnual !== 0) {
                                    button2();
                                    document.getElementById("div1").style.display = "none";
                                } else if (elemento.id == "cie" & mediaAnual !== 0) {
                                    button1();
                                    document.getElementById("div1").style.display = "none";
                                } else if (elemento.id == "fil" & mediaAnual !== 0) {
                                    button2();
                                    document.getElementById("div1").style.display = "none";
                                } else if (elemento.id == "fis" & mediaAnual !== 0) {
                                    button2();
                                    document.getElementById("div1").style.display = "none";
                                } else if (elemento.id == "qui" & mediaAnual !== 0) {
                                    button2();
                                    document.getElementById("div1").style.display = "none";
                                } else if (elemento.id == "soc" & mediaAnual !== 0) {
                                    button2();
                                    document.getElementById("div1").style.display = "none";
                                }
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

function button1() {
    document.getElementById("bt1").disabled = true;
    document.getElementById("bt1").style.backgroundColor = "rgb(0, 225, 0)";
    document.getElementById("bt2").disabled = false;
    document.getElementById("bt2").style.backgroundColor = "rgb(225, 0, 0)";

    document.getElementById("Lcie").style.display = "";
    document.getElementById("Lbio").style.display = "none";
    document.getElementById("Lfis").style.display = "none";
    document.getElementById("Lqui").style.display = "none";
    document.getElementById("Lfil").style.display = "none";
    document.getElementById("Lsoc").style.display = "none";
}

function button2() {
    document.getElementById("bt2").disabled = true;
    document.getElementById("bt2").style.backgroundColor = "rgb(0, 225, 0)";
    document.getElementById("bt1").disabled = false;
    document.getElementById("bt1").style.backgroundColor = "rgb(225, 0, 0)";

    document.getElementById("Lcie").style.display = "none";
    document.getElementById("Lbio").style.display = "";
    document.getElementById("Lfis").style.display = "";
    document.getElementById("Lqui").style.display = "";
    document.getElementById("Lfil").style.display = "";
    document.getElementById("Lsoc").style.display = "";
}