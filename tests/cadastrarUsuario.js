var Chance = require("chance");
var changeInstance = new Chance();

var cartao = {
    numero: "",
    validade: {
        mes: null,
        ano: null
    },
    cvc: ""
};

var usuario = {
    nome: changeInstance.name({gender: "female"}),
    email: changeInstance.email(),
    cpf: changeInstance.cpf()
};

module.exports = {
    'Cartão': function (browser) {
        browser
            .url('http://www.4devs.com.br/gerador_de_numero_cartao_credito')
            .click('input[id="bt_gerar_cc"]')
            .pause(1000);

        var getVal = function (val) {
            return JSON.parse(JSON.stringify(val)).value;
        }

        browser.getValue("#cartao_numero", function (val) {
            cartao.numero = getVal(val);
        });

        browser.getValue("#data_validade", function (val) {
            var validade = getVal(val).split("/");

            cartao.validade.mes = validade[1];
            cartao.validade.ano = validade[2];

        });

        browser.getValue("#codigo_seguranca", function (val) {
            cartao.cvc = getVal(val);
        });

    },

    'Cadastrar usuário Americanas': function (browser) {
        browser
            .url('https://www.americanas.com.br/')
            .click('.usr-icon')
            .pause(1000)
            .click('.usr-signup')
            .pause(3000)
            .setValue('input[name=email]', usuario.email)
            .setValue('input[name=password]', 'senhadeteste1')
            .setValue('input[name=password_repeat]', 'senhadeteste1')
            .setValue('input[name=name]', usuario.nome)
            .pause(1000)
            .click('label[for="gender_female"]')
            .setValue('input[name=cpf]', usuario.cpf)
            .setValue('input[name=birthday]', '01011990')
            .setValue('input[name=tel]', '3432321010')
            .setValue('input[name=cel]', '34999998888')
            .setValue('input[name=cep]', '75533650')
            .pause(3000)
            .setValue('input[name=number]', '8')
            .setValue('input[name=reference]', 'Casa')
            .click('button[name=submit_button]')
            .pause(10000)
            .click('.usr-icon')
            .pause(1000)
            .click('.usr-account')
            .pause(2000)
            .assert.urlEquals('https://minhaconta.americanas.com.br/#/account/home')
            .waitForElementVisible('#mainUiView', 3000)
            .assert.containsText('#mainUiView .order-empty h4 strong', 'você não tem pedidos recentes.')
            .assert.containsText('div.adress-name p:nth-child(2)', 'Rua V 21, 8')
            .assert.containsText('div.adress-name p:nth-child(1)', usuario.nome)
            .assert.visible(".btn.btn-default.btn-md")
            .pause(3000)
            .click('.brd-logo')
            .setValue('input[name=conteudo]', '24901599')
            .click('.src-btn')
            .assert.containsText('.card-product-name', 'Smartphone Motorola Moto E4 Plus, Ouro, XT1773, Tela de 5.5", 16GB, 13MP')
            .pause(2000)
            .click('.card-product-name')
            .pause(2000)
            .click('.btn-buy.btn-lg.btn.btn-primary')
            .pause(2000)
            .assert.containsText('#content .service-flow--title h1 ', 'agora que você já escolheu seu produto, saiba como protegê-lo por mais tempo.')
            .click('.btn.btn-buy.btn-primary.btn-block')
            .pause(2000)
            .setValue('input[name=cep]', '75533650')
            .click('.btn.btn-input.btn-xs.nowrap.btn-freight')
            .pause(3000)
            .click('.btn.btn-primary.btn-default.btn-block.btn-buy.btn-fat.animate-fade')
            .pause(10000)
            .setValue('#creditCard-cardNumber', cartao.numero)
            .pause(3000)
            .setValue('#creditCard-nameOnCard', usuario.nome)
            .execute(`$("#creditCard-ccMonth").val($("#creditCard-ccMonth option[label=${parseInt(cartao.validade.mes, 10)}]").val()).change()`)
            .execute(`$("#creditCard-ccYear").val($("#creditCard-ccYear option[label=${cartao.validade.ano}]").val()).change()`)
            .setValue('input[id=creditCard-creditCard-security]', cartao.cvc)
            .pause(2000)
            .click('button[id=payment-credit-card]')
            .pause(30000)
            .assert.containsText('.ng-scope', 'Pagamento não realizado :(')
            .end();
    }
};
