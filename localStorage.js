const d = document;
const pedidoslocal = 'pedidos';

const cliente = d.querySelector('.cliente');
const producto = d.querySelector('.producto');
const precio = d.querySelector('.precio');
const imagen = d.querySelector('.imagen');
const observacion = d.querySelector('.observacion');
const btnGuardar = d.querySelector('.btn-guardar');
const listaPedidos = d.querySelector('.table > tbody');
const btnEditar = d.querySelector('.btn-editar');
const buscador = d.querySelector('.buscador');
const pdfTotal = d.querySelector('.pdfTotal');


d.addEventListener('DOMContentLoaded', () => {
    borrarTabla();
    listarPedidos();
   
});


btnGuardar.addEventListener('click', () => {
  
   let datos = validarFormulario();
   if(datos != null ) {
   guardarLocalStorage(datos);
    }
   borrarTabla();
   listarPedidos();




});

function validarFormulario() {

    let clienteForm;
    if (cliente.value == '' ||producto.value ==='' || precio.value ===''|| imagen.value ==='') {
        alert('Por favor, complete todos los campos.');
        return;
    } else{
        alert('Formulario enviado correctamente');
        clienteForm = {
            cliente: cliente.value,
            producto: producto.value,
            precio: precio.value,
            imagen: imagen.value,
            observacion: observacion.value
        };
    

    console.log(clienteForm);
    cliente.value = '';
    producto.value = 'seleccione un producto';
    precio.value = '';
    imagen.value = '';
    observacion.value = '';
    return clienteForm;
    }
}


function guardarLocalStorage (datos){
    let pedidos = [];
    pedidosGuardados = JSON.parse(localStorage.getItem(pedidoslocal));
    if (pedidosGuardados !== null) {
        pedidos = pedidosGuardados;
    }

    pedidos.push(datos);
    localStorage.setItem(pedidoslocal, JSON.stringify(pedidos));
    
}


function listarPedidos() {
    let   pedidos = [];
    pedidosGuardados = JSON.parse(localStorage.getItem(pedidoslocal));
    if (pedidosGuardados !== null) {
        pedidos = pedidosGuardados;
    }
    pedidos.forEach((p ,i) => {
        let fila = d.createElement('tr');
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${p.cliente}</td>
            <td>${p.producto}</td>
            <td>${p.precio}</td>
            <td><img src="${p.imagen}" alt="Imagen del producto" width=50%"</td>
            <td>${p.observacion}</td>
            <td> 
            <span onclick='editarPedido(${i})' class="btn-editar  btn btn-primary bg-warning">editar</span>
            <span  onclick='eliminarPedido(${i})' class="btn-eliminar  btn btn-primary bg-danger">eliminar</span>
            <span  onclick='generarPdf(${i})' class="btn-pdf  btn btn-primary">pdf</span>
            </td>
            ` 
            listaPedidos.appendChild(fila);       
    });
}

//quitar datos de tabla
function borrarTabla() {
    let filas = d.querySelectorAll('.table > tbody > tr');
    filas.forEach(f => {
        f.remove();
    });
}

function eliminarPedido(pos) {
      let pedidos = [];
    pedidosGuardados = JSON.parse(localStorage.getItem(pedidoslocal));
    if (pedidosGuardados !== null) {
        pedidos = pedidosGuardados;
    }

    confirmacion = confirm(`¿Estás seguro de eliminar este pedido de ${pedidos[pos].cliente}?`);

    if (confirmacion) {
        let p =pedidos.splice(pos, 1);
        alert(`Pedido de ${p[0].cliente} eliminado correctamente.`);
        localStorage.setItem(pedidoslocal, JSON.stringify(pedidos));
        borrarTabla();
        listarPedidos();   
    }   
}

function editarPedido(pos) {
    let pedidos = [];
    pedidosGuardados = JSON.parse(localStorage.getItem(pedidoslocal));
    if (pedidosGuardados !== null) {
        pedidos = pedidosGuardados;
    }

    cliente.value = pedidos[pos].cliente;
    producto.value = pedidos[pos].producto;
    precio.value = pedidos[pos].precio;
    imagen.value = pedidos[pos].imagen;
    observacion.value = pedidos[pos].observacion;

    btnGuardar.classList.toggle('d-none');
    btnEditar.classList.toggle('d-none');

    btnEditar.addEventListener('click', () => {
        pedidos[pos].cliente = cliente.value;
        pedidos[pos].producto = producto.value;
        pedidos[pos].precio = precio.value;
        pedidos[pos].observacion = observacion.value;

        localStorage.setItem(pedidoslocal, JSON.stringify(pedidos));
        alert(`Pedido de ${pedidos[pos].cliente} editado correctamente.`);
        
        borrarTabla();
        listarPedidos();

        btnGuardar.classList.toggle('d-none');
        btnEditar.classList.toggle('d-none');

        cliente.value = '';
        producto.value = 'seleccione un producto';
        precio.value = '';
        imagen.value = '';
        observacion.value = '';
    })

}    

function buscar (){
    let pedidos = [];
    pedidosGuardados = JSON.parse(localStorage.getItem(pedidoslocal));
    if (pedidosGuardados !== null) {
        pedidos = pedidosGuardados;
    }

    let criterio = buscador.value.toLowerCase();
    let resultado = pedidos.filter(p => p.cliente.toLowerCase().includes(criterio));
    
    borrarTabla();
    
    if (resultado.length > 0) {
        resultado.forEach((p, i) => {
            let fila = d.createElement('tr');
            fila.innerHTML = `
                <td>${i + 1}</td>
                <td>${p.cliente}</td>
                <td>${p.producto}</td>
                <td>${p.precio}</td>
                <td><img src="${p.imagen}" alt="Imagen del producto" width=50%"</td>
                <td>${p.observacion}</td>
                <td> 
                <span onclick='editarPedido(${i})' class="btn-editar  btn btn-primary bg-warning">editar</span>
                <span  onclick='eliminarPedido(${i})' class="btn-eliminar  btn btn-primary bg-danger">eliminar</span>
                 <span  onclick='generarPdf(${i})' class="btn-pdf  btn btn-primary ">pdf</span>
                </td>
            ` 
            listaPedidos.appendChild(fila);       
        });
    } else {
        alert('No se encontraron resultados.');
    }
}


pdfTotal.addEventListener('click', generarPdfTotal);

function generarPdfTotal() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let pedidos = [];
    pedidosGuardados = JSON.parse(localStorage.getItem(pedidoslocal));
    if (pedidosGuardados !== null) {
        pedidos = pedidosGuardados; 
    }
    let y = 20;
    doc.text('Listado de pedidos', 10, 10);
    doc.setFontSize(10);
    doc.text('N°', 10, 16);
    doc.text('Cliente', 20, 16);
    doc.text('Producto', 60, 16);
    doc.text('Precio', 100, 16);
    doc.text('Observación', 130, 16);
    pedidos.forEach((p, i) => {
        doc.text(String(i + 1), 10, y);
        doc.text(p.cliente, 20, y);
        doc.text(p.producto, 60, y);
        doc.text(String(p.precio), 100, y);
        doc.text(p.observacion || '', 130, y);
        y += 8;
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });
    doc.save('pedidos.pdf');
}

function generarPdf(pos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let pedidos = JSON.parse(localStorage.getItem(pedidoslocal)) || [];
    doc.setFontSize(14);
    doc.text('Detalle del Pedido', 10, 10);

    doc.setFontSize(12);
    doc.text('Cliente: ' + (pedidos[pos].cliente || ''), 10, 25);
    doc.text('Producto: ' + (pedidos[pos].producto || ''), 10, 35);
    doc.text('Precio: ' + (pedidos[pos].precio || ''), 10, 45);
    doc.imagen(pedidos[pos].imagen || '', 10, 50, { width: 50, height: 50 });
    doc.text('Observación: ' + (pedidos[pos].observacion || ''), 10, 55);
    doc.text('Fecha: ' + new Date().toLocaleDateString(), 10, 65);

    doc.save(`pedido_${pedidos[pos].cliente || 'sin_nombre'}.pdf`);
}