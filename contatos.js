// JavaScript Document
window.addEventListener('load', carregado);

var db = openDatabase('dbContato', '1.0', 'Cadastro de Contatos', 2 * 1024 * 1024 );

	db.transaction(function(tx){
		
		tx.executeSql('CREATE TABLE IF NOT EXISTS cadastro (id INTEGER PRIMARY KEY, nome TEXT, telefone TEXT, email TEXT, sexo INTEGER)');	
	});

function carregado(){
	document.getElementById("botao-salvar").addEventListener('click', salvar);
	listar();		
}

function salvar(){
	
	var id		 = document.getElementById("valor-id").value;
	var nome 	 = document.getElementById("nome").value;
	var telefone = document.getElementById("telefone").value;
	var email 	 = document.getElementById("email").value;
	var sexo 	 = parseInt(document.getElementById("sexo").value);
	
	db.transaction(function(tx){
		if(id != ""){
			
			tx.executeSql('UPDATE cadastro SET nome=?, telefone=?, email=?, sexo=? WHERE id=?', [nome, telefone, email, sexo, id]);	
		}else{
			
			tx.executeSql('INSERT INTO cadastro (nome, telefone, email, sexo) values (?,?,?,?)', [nome, telefone, email, sexo]);
		}
	});
	listar();
	inicializa();
		
}

function listar(){
	var listagem = document.getElementById('listagem');
	
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM cadastro', [], function(tx, resultado){
			var rows = resultado.rows;
			var tr = '';
			for(var i = 0; i < rows.length; i++){
				
				/* Pega o id do sexo */
				var valorSx = rows[i].sexo;
				
				/* Recebe o sexo */
				if(valorSx == 1) {
					var nomeSx = 'Masculino';
				} else {
					var nomeSx = 'Feminino';
				}
				
				tr += '<tr>';
				tr += '<td>' + rows[i].nome + '</td>';
				tr += '<td>' + rows[i].telefone + '</td>';
				tr += '<td>' + rows[i].email + '</td>';
				tr += '<td>' + nomeSx + '</td>';
				tr += '<td><button class="btn btn-warning" onClick="atualizar('+ rows[i].id +')">Alterar</button></td>';
				tr += '<td><button class="btn btn-danger" onClick="excluir('+ rows[i].id +')">Excluir</button></td>';
				tr += '</tr>'	
			}
			listagem.innerHTML	 = tr;
			
		});
	},null);
}

function atualizar(_id){
	
	var id 		 = document.getElementById('valor-id');
	var nome 	 = document.getElementById('nome');
	var telefone = document.getElementById('telefone');
	var email 	 = document.getElementById('email');
	var sexo 	 = parseInt(document.getElementById('sexo'));
	
	id.value = _id;
	
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM cadastro WHERE id=?', [_id], function(tx, resultado){
			var rows = resultado.rows[0];	
			
			nome.value 	   = rows.nome;
			telefone.value = rows.telefone;
			email.value    = rows.email;
			sexo.value     = rows.sexo;
		});
	});	
}

function excluir(id){
			
	db.transaction(function(tx){
		tx.executeSql('DELETE FROM cadastro WHERE id=?', [id]);
	});
	listar();
}

function inicializa(){
    
    document.getElementById('valor-id').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('email').value = '';
	document.getElementById('sexo').value = '';
}