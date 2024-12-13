import { addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'

export const confirmacionReservacionFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer('¡Tu cita ha sido agendada correctamente! 🎉 Aquí está la información que proporcionaste:',
        { capture: true },
        async (ctx, { globalState, flowDynamic }) => {
            return await flowDynamic([
                `Sucursal: ${globalState.get('sucursal')}`,
                `Día: ${globalState.get('dia')}`,
                `Horario: ${globalState.get('horario')}`
            ])
        })
    .addAnswer('Si toda la información es correcta, por favor confirma tu cita eligiendo una de las siguientes opciones:',
        { buttons: [{ body: 'Confirmar' }, { body: 'Hacer cambio' }] },
        async (ctx, { flowDynamic, gotoFlow }) => {
            if (ctx.body === 'Confirmar') return await flowDynamic('Agradecemos mucho tu preferencia y estamos felices de poder atenderte. ¡Esperamos verte pronto! 😊')
            else return gotoFlow(reservacionFlow)
        }
    )

export const horarioLVFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer('¡Perfecto! Ahora que elegiste el día, selecciona el horario que más te convenga para tu cita.')
    .addAnswer([
        'Estos son los horarios disponibles:',
        '1. 9:00 AM - 10:00 AM',
        '2. 10:00 AM - 11:00 AM',
        '3. 11:00 AM - 12:00 PM',
        '4. 12:00 PM - 1:00 PM',
        '5. 1:00 PM - 2:00 PM',
        '6. 2:00 PM - 3:00 PM',
        '7. 3:00 PM - 4:00 PM',
        '8. 4:00 PM - 5:00 PM',
        '9. 5:00 PM - 6:00 PM',
        '10. 6:00 PM - 7:00 PM',
        '11. 7:00 PM - 7:40 PM',
        'Responde con el número del horario que prefieras y con gusto confirmaremos tu cita. 😊'
    ],
        { capture: true },
        async (ctx, { gotoFlow, flowDynamic, globalState, fallBack }) => {
            if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].includes(ctx.body)) return fallBack('Opcion no valida, vuelve a intentarlo')
            switch (ctx.body) {
                case "1":
                    await globalState.update({ horario: '9:00 AM - 10:00 AM' });
                    break
                case "2":
                    await globalState.update({ horario: '10:00 AM - 11:00 AM' });
                    break;
                case "3":
                    await globalState.update({ horario: '11:00 AM - 12:00 PM' });
                    break;
                case "4":
                    await globalState.update({ horario: '12:00 PM - 1:00 PM' });
                    break;
                case "5":
                    await globalState.update({ horario: '1:00 PM - 2:00 PM' });
                    break;
                case "6":
                    await globalState.update({ horario: '2:00 PM - 3:00 PM' });
                    break;
                case "7":
                    await globalState.update({ horario: '3:00 PM - 4:00 PM' });
                    break;
                case "8":
                    await globalState.update({ horario: '4:00 PM - 5:00 PM' });
                    break;
                case "9":
                    await globalState.update({ horario: '5:00 PM - 6:00 PM' });
                    break;
                case "10":
                    await globalState.update({ horario: '6:00 PM - 7:00 PM' });
                    break;
                default:
                    await globalState.update({ horario: '7:00 PM - 7:40 PM' });
                    break;
            }
            return gotoFlow(confirmacionReservacionFlow);
        }

    )

export const horarioSFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer('¡Perfecto! Ahora que elegiste el día, selecciona el horario que más te convenga para tu cita.')
    .addAnswer([
        'Estos son los horarios disponibles:',
        '1. 9:00 AM - 10:00 AM',
        '2. 10:00 AM - 11:00 AM',
        '3. 11:00 AM - 12:00 PM',
        '4. 12:00 PM - 1:00 PM',
        '5. 1:00 PM - 2:00 PM',
        '6. 2:00 PM - 3:00 PM',
        '7. 3:00 PM - 3:40 PM',
        'Responde con el número del horario que prefieras y con gusto confirmaremos tu cita. 😊'
    ],
        { capture: true },
        async (ctx, { gotoFlow, flowDynamic, globalState, fallBack }) => {
            if (!['1', '2', '3', '4', '5', '6', '7'].includes(ctx.body)) return fallBack('Opcion no valida, vuelve a intentarlo')
            switch (ctx.body) {
                case "1":
                    await globalState.update({ horario: '9:00 AM - 10:00 AM' });
                    break
                case "2":
                    await globalState.update({ horario: '10:00 AM - 11:00 AM' });
                    break;
                case "3":
                    await globalState.update({ horario: '11:00 AM - 12:00 PM' });
                    break;
                case "4":
                    await globalState.update({ horario: '12:00 PM - 1:00 PM' });
                    break;
                case "5":
                    await globalState.update({ horario: '1:00 PM - 2:00 PM' });
                    break;
                case "6":
                    await globalState.update({ horario: '2:00 PM - 3:00 PM' });
                    break;
                default:
                    await globalState.update({ horario: '3:00 PM - 3:40 PM' });
                    break;
            }
            return gotoFlow(confirmacionReservacionFlow);
        }

    )

export const reservacionFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(`Este es para consultas¡Genial! Para ayudarte a hacer la reservación, necesito saber a qué sucursal te gustaría agendarla.`)
    .addAnswer([
        'Por favor, elige una de las siguientes opciones:',
        '1. Nuevo Laredo',
        '2. Monterrey',
        '3. Guadalajara',
        'Responde con el número de la sucursal y con gusto te ayudaré a continuar con tu cita. 😊'
    ],
        { capture: true },
        async (ctx, { gotoFlow, flowDynamic, globalState, fallBack }) => {
            if (!['1', '2', '3'].includes(ctx.body)) return fallBack('Opcion no valida, vuelve a intentarlo')
            switch (ctx.body) {
                case "1":
                    return await globalState.update({ sucursal: 'Nuevo Laredo' });
                case "2":
                    return await globalState.update({ sucursal: 'Monterrey' });
                default:
                    return await globalState.update({ sucursal: 'Guadalajara' });
            }
        }
    )
    .addAnswer(`Perfecto, ya que elegiste la sucursal, ahora necesitamos saber qué día de la semana te gustaría agendar tu cita.`)
    .addAnswer([
        'Por favor, elige uno de los siguientes días:',
        '1. Lunes',
        '2. Martes',
        '3. Miércoles',
        '4. Jueves',
        '5. Viernes',
        '6. Sábado',
        'Responde con el número del día que prefieras, y seguiremos con el siguiente paso. 😊'
    ],
        { capture: true },
        async (ctx, { gotoFlow, flowDynamic, globalState, fallBack }) => {
            if (!['1', '2', '3', '4', '5', '6'].includes(ctx.body)) return fallBack('Opcion no valida, vuelve a intentarlo')
            switch (ctx.body) {
                case "1":
                    await globalState.update({ dia: 'Lunes' });
                    return gotoFlow(horarioLVFlow)
                case "2":
                    await globalState.update({ dia: 'Martes' });
                    return gotoFlow(horarioLVFlow)
                case "3":
                    await globalState.update({ dia: 'Miercoles' });
                    return gotoFlow(horarioLVFlow)
                case "4":
                    await globalState.update({ dia: 'Jueves' });
                    return gotoFlow(horarioLVFlow)
                case "5":
                    await globalState.update({ dia: 'Viernes' });
                    return gotoFlow(horarioLVFlow)
                default:
                    await globalState.update({ dia: 'Sabado' });
                    return gotoFlow(horarioSFlow)
            }
        }
    )