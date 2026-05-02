$(document).ready(function () {

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

    var nuevaFila = `
      <tr style="display:none">
        <td>${nombreTarea}</td>
        <td>
          <span class="badge ${claseBadge}">
            ${iconoBadge} ${prioridad}
          </span>
        </td>
        <td>
          <button class="btn btn-eliminar">✕ Eliminar</button>
        </td>
      </tr>
    `;

    var filaAgregada = tabla.row.add($(nuevaFila)).draw().node();
    $(filaAgregada).fadeIn(400);

    $('#contadorTareas').text(tabla.rows().count());

    $('#nombreTarea').val('');
    $('#prioridad').val('Alta');
  });

  $('#tablaTareas').on('click', '.btn-eliminar', function () {
    var fila = $(this).closest('tr');
    fila.fadeOut(300, function () {
      tabla.row(fila).remove().draw();
      $('#contadorTareas').text(tabla.rows().count());
    });
  });

});
