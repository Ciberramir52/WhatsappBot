import * as dotenv from 'dotenv';
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { MetaProvider as Provider } from '@builderbot/provider-meta'
import path from 'path'
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config()

const PORT = process.env.PORT ?? 3008

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const menuPath = path.join(__dirname, "..", "mensajes", "menu.txt")
const menu = fs.readFileSync(menuPath, "utf-8")

const menuRestFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(`Este es el Menu`, {
        media: "https://q.bstatic.com/data/bsuitewf/fbd9a24033c5b7c8ea5d4c8c1f84bf9e9ae4eb4a.pdf"
    })

const reservarFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(`Este es para reservar: www.hacertureserva.com`)

const consultasFlow = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(`Este es para consultas`)

const welcomeFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAnswer(`Este es el flujo Welcome`, {
        delay: 100,
    },
        async (ctx, ctxFn) => {
            if (ctx.body.includes("casas")) {
                await ctxFn.flowDynamic("Escribiste casas")
            } else {
                await ctxFn.flowDynamic("Escribiste otra cosa")
            }
            console.log(ctx.body)
        })

// const menu = "Este es el menu de opciones, elegi opciones 1,2,3,4,5 o 0"
const menuFlow = addKeyword<Provider, Database>("Menu").addAnswer(
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3", "0"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones."
            );
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(menuRestFlow)
            case "2":
                return gotoFlow(reservarFlow)
            case "3":
                // console.log(result)
                return gotoFlow(consultasFlow)
            case "0":
                return await flowDynamic(
                    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'"
                );
        }
    }
);

const main = async () => {
    const adapterFlow = createFlow([welcomeFlow, reservarFlow, menuRestFlow, consultasFlow, menuFlow])
    const adapterProvider = createProvider(Provider, {
        jwtToken: process.env.jwtToken,
        numberId: process.env.numberId,
        verifyToken: process.env.verifyToken,
        version: 'v21.0'
    })
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
