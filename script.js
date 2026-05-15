$(document).ready(function () {
  // Inicialización de DataTables con el id de tablatareas con opciones personalizadas y estilos para el contador de tareas 
  var tabla = $('#tablaTareas').DataTable({
    language: {
      search:      "Buscar:",
      lengthMenu:  "Mostrar _MENU_ tareas",
      info:        "Mostrando _START_ a _END_ de _TOTAL_ tareas",
      infoEmpty:   "Sin tareas registradas",
      paginate: {
        previous: "←",
        next:     "→"
      },
      zeroRecords: "No se encontraron tareas"
    },
    columnDefs: [
      { targets: 2, orderable: false }
    ],
    pageLength: 5
  });

  var tareas = JSON.parse(localStorage.getItem('tareas')) || [];

  function guardarTareas() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }

  function actualizarContador() {
    $('#contadorTareas').text(tabla.rows().count());
  }

  function crearFilaTarea(tarea) {
    return `
      <tr style="display:none">
        <td>${tarea.nombre}</td>
        <td>
          <span class="badge ${tarea.claseBadge}">
            ${tarea.iconoBadge} ${tarea.prioridad}
          </span>
        </td>
        <td>
          <button class="btn btn-eliminar">✕ Eliminar</button>
        </td>
      </tr>
    `;
  }

  function cargarTareas() {
    tareas.forEach(function (tarea) {
      var filaAgregada = tabla.row.add($(crearFilaTarea(tarea))).draw(false).node();
      $(filaAgregada).fadeIn(0);
    });
    actualizarContador();
  }

  $('#mensajeError').hide();
  cargarTareas();

  $('#titulo').hover(
    function () {
      $(this).css({
        'background':              'linear-gradient(135deg, #F59E0B, #EF4444)',
        '-webkit-background-clip': 'text',
        'background-clip':         'text',
        'transform':               'scale(1.02)'
      });
    },
    function () {
      $(this).css({
        'background':              'linear-gradient(135deg, #A78BFA, #F59E0B)',
        '-webkit-background-clip': 'text',
        'background-clip':         'text',
        'transform':               'scale(1)'
      });
    }
  );

  $('#formTarea').on('submit', function (e) {
    e.preventDefault();

    var nombreTarea = $('#nombreTarea').val().trim();
    var prioridad   = $('#prioridad').val();

    if (nombreTarea === '') {
      $('#mensajeError').show();
      $('#nombreTarea').css('border-color', 'var(--danger)');
      return;
    }

    $('#mensajeError').hide();
    $('#nombreTarea').css('border-color', 'var(--border)');

    var claseBadge = 'badge-baja';
    var iconoBadge = '⚪';
    if (prioridad === 'Alta') {
      claseBadge = 'badge-alta';
      iconoBadge = '🟢';
    } else if (prioridad === 'Media') {
      claseBadge = 'badge-media';
      iconoBadge = '🟡';
    }

    var tareaObj = {
      nombre: nombreTarea,
      prioridad: prioridad,
      claseBadge: claseBadge,
      iconoBadge: iconoBadge
    };

    tareas.push(tareaObj);
    guardarTareas();

    var filaAgregada = tabla.row.add($(crearFilaTarea(tareaObj))).draw().node();
    $(filaAgregada).fadeIn(400);

    actualizarContador();

    $('#nombreTarea').val('');
    $('#prioridad').val('Alta');
  });

  $('#tablaTareas').on('click', '.btn-eliminar', function () {
    var fila = $(this).closest('tr');
    var nombreEliminar = fila.find('td:eq(0)').text();
    var prioridadEliminar = fila.find('td:eq(1) .badge').text().trim();
    var eliminado = false;

    tareas = tareas.filter(function (item) {
      if (!eliminado && item.nombre === nombreEliminar && `${item.iconoBadge} ${item.prioridad}` === prioridadEliminar) {
        eliminado = true;
        return false;
      }
      return true;
    });

    guardarTareas();

    fila.fadeOut(300, function () {
      tabla.row(fila).remove().draw();
      actualizarContador();
    });
  });
});
