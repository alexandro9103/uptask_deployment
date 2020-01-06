import Swal from 'sweetalert2';
export const actualizarAvance = () => {
    const tareas = document.querySelectorAll('li.tarea');


    if (tareas.length) {
        const tareasCompletas = document.querySelectorAll('i.completo');
        const avance = Math.round((tareasCompletas.length * 100) / tareas.length);
        const porcentaje = document.querySelector('#porcentaje');

        porcentaje.style.width = avance + '%';

        if (avance === 100) {
            Swal.fire(
                'Completaste el proyecto',
                'Felicidades, has terminado tus Tareas',
                'success'
            )
        }
    }

}