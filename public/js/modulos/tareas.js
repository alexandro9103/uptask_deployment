import Axios from "axios";
import Swal from "sweetalert2";
import {
    actualizarAvance
} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');


if (tareas) {
    tareas.addEventListener('click', (e) => {

        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            //console.log(idTarea)
            const url = `${location.origin}/tareas/${idTarea}`;
            //console.log(url);
            Axios.patch(url, {
                idTarea
            }).then(res => {
                if (res.status === 200) {
                    icono.classList.toggle('completo');
                    actualizarAvance();
                }
            }).catch(err => {
                console.log(err)
            })
        }

        if (e.target.classList.contains('fa-trash')) {

            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;


            Swal.fire({
                title: 'Deseas borrar esta Tarea?',
                text: 'Una tarea eliminada no se puede recuperar',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'No, Cancelar',
                confirmButtonText: 'Si, Borrar'
            }).then((result) => {
                if (result.value) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    Axios.delete(url, {
                            params: idTarea
                        }).then((resp) => {
                            console.log(resp);
                            if (result.value) {
                                tareaHTML.parentElement.removeChild(tareaHTML);
                                Swal.fire('Tarea Borrada', 'La Tarea se ha borrado', 'success');
                                actualizarAvance();

                                /*  setTimeout(() => {
                                     window.location.href = '/';
                                 }, 3000); */
                            }
                        })
                        .catch((err) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Hubo un error',
                                text: 'No se pudo eliminar la Tarea'
                            })
                        });
                }

            });

        }

    });

}


export default tareas;