document.addEventListener('DOMContentLoaded', (event) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Obtém a referência à coleção "bimestre1"
            var collection = firebase.firestore().collection("bimestre2");

            // Obtém o documento do usuário atual
            collection.doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    // Preenche os campos com os valores do documento
                    const data = doc.data();
                    document.getElementById('artn1').value = data.artb2n1 || '';
                    document.getElementById('artn2').value = data.artb2n2 || '';
                    document.getElementById('bion1').value = data.biob2n1 || '';
                    document.getElementById('bion2').value = data.biob2n2 || '';
                    document.getElementById('edfn1').value = data.edfb2n1 || '';
                    document.getElementById('edfn2').value = data.edfb2n2 || '';
                    document.getElementById('filn1').value = data.filb2n1 || '';
                    document.getElementById('filn2').value = data.filb2n2 || '';
                    document.getElementById('fisn1').value = data.fisb2n1 || '';
                    document.getElementById('fisn2').value = data.fisb2n2 || '';
                    document.getElementById('geon1').value = data.geob2n1 || '';
                    document.getElementById('geon2').value = data.geob2n2 || '';
                    document.getElementById('hisn1').value = data.hisb2n1 || '';
                    document.getElementById('hisn2').value = data.hisb2n2 || '';
                    document.getElementById('ingn1').value = data.ingb2n1 || '';
                    document.getElementById('ingn2').value = data.ingb2n2 || '';
                    document.getElementById('matn1').value = data.matb2n1 || '';
                    document.getElementById('matn2').value = data.matb2n2 || '';
                    document.getElementById('porn1').value = data.porb2n1 || '';
                    document.getElementById('porn2').value = data.porb2n2 || '';
                    document.getElementById('quin1').value = data.quib2n1 || '';
                    document.getElementById('quin2').value = data.quib2n2 || '';
                    document.getElementById('elen1').value = data.eleb2n1 || '';
                    document.getElementById('elen2').value = data.eleb2n2 || '';
                    document.getElementById('invn1').value = data.invb2n1 || '';
                    document.getElementById('invn2').value = data.invb2n2 || '';

                    // Atualiza as médias
                    calcularMediaIndividual('artn1', 'artn2', 'artmb');
                    calcularMediaIndividual('bion1', 'bion2', 'biomb');
                    calcularMediaIndividual('edfn1', 'edfn2', 'edfmb');
                    calcularMediaIndividual('filn1', 'filn2', 'filmb');
                    calcularMediaIndividual('fisn1', 'fisn2', 'fismb');
                    calcularMediaIndividual('geon1', 'geon2', 'geomb');
                    calcularMediaIndividual('hisn1', 'hisn2', 'hismb');
                    calcularMediaIndividual('ingn1', 'ingn2', 'ingmb');
                    calcularMediaIndividual('matn1', 'matn2', 'matmb');
                    calcularMediaIndividual('porn1', 'porn2', 'pormb');
                    calcularMediaIndividual('quin1', 'quin2', 'quimb');
                    calcularMediaIndividual('elen1', 'elen2', 'elemb');
                    calcularMediaIndividual('invn1', 'invn2', 'invmb');
                } else {
                    console.log("Documento não encontrado");
                }
            }).catch((error) => {
                console.error("Erro ao consultar documento:", error);
            });
        } else {
            console.log("Nenhum usuário conectado");
        }
    });
});

function comeback() {
    window.location.href = "../home.html";
}

function salvar() {
    var user = firebase.auth().currentUser;
	if (user) {
        console.log(user)
		var collection = firebase.firestore().collection("bimestre2");
		var data = {
			"artb2n1": document.getElementById('artn1').value,
			"artb2n2": document.getElementById('artn2').value,
			"biob2n1": document.getElementById('bion1').value,
			"biob2n2": document.getElementById('bion2').value,
			"edfb2n1": document.getElementById('edfn1').value,
			"edfb2n2": document.getElementById('edfn2').value,
			"filb2n1": document.getElementById('filn1').value,
			"filb2n2": document.getElementById('filn2').value,
			"fisb2n1": document.getElementById('fisn1').value,
			"fisb2n2": document.getElementById('fisn2').value,
			"geob2n1": document.getElementById('geon1').value,
			"geob2n2": document.getElementById('geon2').value,
			"hisb2n1": document.getElementById('hisn1').value,
			"hisb2n2": document.getElementById('hisn2').value,
			"ingb2n1": document.getElementById('ingn1').value,
			"ingb2n2": document.getElementById('ingn2').value,
			"matb2n1": document.getElementById('matn1').value,
			"matb2n2": document.getElementById('matn2').value,
			"porb2n1": document.getElementById('porn1').value,
			"porb2n2": document.getElementById('porn2').value,
			"quib2n1": document.getElementById('quin1').value,
			"quib2n2": document.getElementById('quin2').value,
			"eleb2n1": document.getElementById('elen1').value,
			"eleb2n2": document.getElementById('elen2').value,
			"invb2n1": document.getElementById('invn1').value,
			"invb2n2": document.getElementById('invn2').value
    	}
		
        collection.doc(user.uid).set(data, {merge: true}).then(() => {
            calcularMediaIndividual('artn1', 'artn2', 'artmb');
            calcularMediaIndividual('bion1', 'bion2', 'biomb');
            calcularMediaIndividual('edfn1', 'edfn2', 'edfmb');
            calcularMediaIndividual('filn1', 'filn2', 'filmb');
            calcularMediaIndividual('fisn1', 'fisn2', 'fismb');
            calcularMediaIndividual('geon1', 'geon2', 'geomb');
            calcularMediaIndividual('hisn1', 'hisn2', 'hismb');
            calcularMediaIndividual('ingn1', 'ingn2', 'ingmb');
            calcularMediaIndividual('matn1', 'matn2', 'matmb');
            calcularMediaIndividual('porn1', 'porn2', 'pormb');
            calcularMediaIndividual('quin1', 'quin2', 'quimb');
            calcularMediaIndividual('elen1', 'elen2', 'elemb');
            calcularMediaIndividual('invn1', 'invn2', 'invmb');
            
            alert("Suas notas foram salvas");
        }).catch((error) => {
            alert("Erro em salvar suas notas: " + error.message);
            console.error("Erro ao salvar notas: ", error);
        }); 
    } else {
        alert("Nenhum usuário está conectado");
    }
}

function calcularMediaIndividual(id1, id2, idResultado) {
    const n1 = document.getElementById(id1).value;
    const n2 = document.getElementById(id2).value;

    if (!n1 || isNaN(parseFloat(n1))) {
        alert(`Algum valor está inválido`);
        return;
    }

    if (!n2 || isNaN(parseFloat(n2))) {
        alert(`Algum valor está inválido`);
        return;
    }

    const media = (parseFloat(n1) + parseFloat(n2)) / 2;
    const resultadoElemento = document.getElementById(idResultado);

    if (resultadoElemento) {
        resultadoElemento.textContent = media.toFixed(2);
    } else {
        console.error(`Elemento com ID ${idResultado} não encontrado`);
    }
}