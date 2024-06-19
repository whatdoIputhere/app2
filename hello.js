const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
dotenv = require('dotenv');
dotenv.config();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const cookieString = "_ga_BKQGQSWK0Z=GS1.1.1708340915.2.0.1708340925.0.0.0; _ga_RKQ3S0WP1N=GS1.1.1708340915.2.0.1708340925.0.0.0; _ga_Q52M9CYF1D=GS1.1.1708340915.2.0.1708340925.0.0.0; _ga_2FNYSG538E=GS1.1.1708340891.1.1.1708341748.0.0.0; _ga_MZ2C7JMSW7=GS1.2.1713440711.5.1.1713440764.0.0.0; _ga=GA1.1.1825153188.1706086987; _ga_H5M1PS4Q5B=GS1.1.1718111258.12.1.1718111873.0.0.0; MoodleSession202223=uie17lvtmrptn65re917n2io71; MoodleSession202324=tobprtrptn6dqqk1vtvu9rc7h3";

const transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const mailOptions = {
    from: 'pv19910@alunos.estgv.ipv.pt',
    to: 'pv19910@alunos.estgv.ipv.pt, pv19889@alunos.estgv.ipv.pt',
    subject: 'SAIU NOTAS DE REDES',
    text: 'SAIU NOTAS DE REDES'
};

oldAvalElement = `<span class="hidden sectionname">Avaliação </span><div class="left side"></div><div class="right side"><img class="icon spacer" width="1" height="1" alt="" aria-hidden="true" src="https://moodle.estgv.ipv.pt/theme/image.php/klass/core/1716366919/spacer"></div><div class="content"><h3 class="sectionname"><span><a href="https://moodle.estgv.ipv.pt/course/view.php?id=6581#section-2">Avaliação </a></span></h3><div class="section_availability"></div><div class="summary"></div><ul class="section img-text"><li class="activity resource modtype_resource " id="module-207838"><div><div class="mod-indent-outer"><div class="mod-indent"></div><div><div class="activityinstance"><a class="" onclick="" href="https://moodle.estgv.ipv.pt/mod/resource/view.php?id=207838"><img src="https://moodle.estgv.ipv.pt/theme/image.php/klass/core/1716366919/f/pdf-24" class="iconlarge activityicon" alt="" role="presentation" aria-hidden="true"><span class="instancename">Resultados da componente Prática 2022/2023<span class="accesshide "> Ficheiro</span></span></a></div></div></div></div></li><li class="activity resource modtype_resource " id="module-216382"><div><div class="mod-indent-outer"><div class="mod-indent"></div><div><div class="activityinstance"><a class="" onclick="" href="https://moodle.estgv.ipv.pt/mod/resource/view.php?id=216382"><img src="https://moodle.estgv.ipv.pt/theme/image.php/klass/core/1716366919/f/pdf-24" class="iconlarge activityicon" alt="" role="presentation" aria-hidden="true"><span class="instancename">Resultados da avaliação Prática - TP3, TP4 e TP7<span class="accesshide "> Ficheiro</span></span></a></div></div></div></div></li><li class="activity label modtype_label " id="module-207836"><div><div class="mod-indent-outer"><div class="mod-indent"></div><div><div class="contentwithoutlink "><div class="no-overflow"><div class="no-overflow"><p>De acordo com as regras de avaliação da UC de Redes de Comunicação II, o acesso à Época Normal (Frequência e Exame de Época Normal) &nbsp;implica o estudante ter avaliação &gt;=9,5 na componente prática.&nbsp;</p><p>A melhoria de classificação é permitida em época de recurso. No caso de um estudante ter aprovação na Frequência e realizar o Exame de Época Normal, será contabilizada para a classificação final em época normal, a classificação obtida no Exame de Época Normal (mesmo que inferior à obtida na Frequência).</p></div></div></div></div></div></div></li><li class="activity resource modtype_resource " id="module-207837"><div><div class="mod-indent-outer"><div class="mod-indent mod-indent-1"></div><div><div class="activityinstance"><a class="" onclick="" href="https://moodle.estgv.ipv.pt/mod/resource/view.php?id=207837"><img src="https://moodle.estgv.ipv.pt/theme/image.php/klass/core/1716366919/f/pdf-24" class="iconlarge activityicon" alt="" role="presentation" aria-hidden="true"><span class="instancename">Acesso à Frequência 2024 (Provisório - Atualizado a 5/6/2024)<span class="accesshide "> Ficheiro</span></span></a></div></div></div></div></li></ul></div>`;

oldTesteElement = `<span class="hidden sectionname">Secção de Testes</span><div class="left side"></div><div class="right side"><img class="icon spacer" width="1" height="1" alt="" aria-hidden="true" src="https://moodle.estgv.ipv.pt/theme/image.php/klass/core/1716366919/spacer"></div><div class="content"><h3 class="sectionname"><span><a href="https://moodle.estgv.ipv.pt/course/view.php?id=6581#section-6">Secção de Testes</a></span></h3><div class="section_availability"><div class="availabilityinfo ishidden">
    <span class="badge badge-info">Não disponível</span>
</div></div><div class="summary"></div></div>`;

console.log("started")
setInterval(() => {
    console.log("Fetching HTML");
    fetch("https://moodle.estgv.ipv.pt/course/view.php?id=6581", {
        headers: {
            Cookie: cookieString
        }
    }).then(response => {
        if (response.ok) {
            console.log("Response OK");
            return response.text();
        } else {
            console.log("Response not OK");
            throw new Error("Something went wrong");
        }
    }).then(html => {
        console.log("HTML fetched");
        const dom = new JSDOM(html);
        const newDOM = dom.window.document;
        if (oldTesteElement != null) {
            const newAvalElement = newDOM.querySelector('#section-2');
            console.log(new Date().toLocaleString());
            if (oldAvalElement != newAvalElement.innerHTML) {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                console.log("Different");
                console.log("Opening newaval.html in browser");
            } else {
                console.log("No changes #1");
            }
            const newTesteElement = newDOM.querySelector('#section-6');

            if (oldTesteElement != newTesteElement.innerHTML) {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                    }
                });
                console.log("Different");
            } else {
                console.log("No changes #2");
            }
            console.log();
        }
    }).catch(error => {
        console.error(error);
    });
}, 30 * 1000);