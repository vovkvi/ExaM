var currentCard = 0;
var countCard = 0;
var docs = [
    {
        "ot" : [
            "ОТ",
            "Правила по охране труда",
            "ri-alert-fill"
            ],
        "pprp" : [
            "ППРП",
            "Правила работы с персоналом",
            "ri-group-fill"
        ],
        "pte" : [
            "ПТЭ",
            "Правила технической эксплуатации",
            "ri-tools-fill"
            ],
    },
    {
        "eb2" : [
            "ЭБ-II",
            "Электробезопасность (группа II)",
            "ri-flashlight-fill"
            ],
        "eb3" : [
            "ЭБ-III",
            "Электробезопасность (группа III)",
            "ri-flashlight-fill"], 
        "eb4" : [
            "ЭБ-IV",
            "Электробезопасность (группа IV)",
            "ri-flashlight-fill"
            ],
        "eb5" : [
            "ЭБ-V",
            "Электробезопасность (группа V)",
            "ri-flashlight-fill"
            ],
    },
    {
        "pb" : [
            "ПБ",
            "Правила пожарной безопасности",
            "ri-fire-fill"
            ],
        "nds" : [
            "НДС",
            "Нарядно-допускная система",
            "ri-edit-2-fill"
            ],
        "op" : [
            "ОП",
            "Правила производства оперативных переключений",
            "ri-scan-fill"
            ],
    },
];

Hyphenopoly.config({
    require: {
        "ru": "восьмидесятивосьмимиллиметровое",
        "de": "Silbentrennungsalgorithmus",
        "en-us": "Supercalifragilisticexpialidocious"
    },
    paths: {
        patterndir: "./side-packages/hyphenopoly/patterns/",
        maindir: "./side-packages/hyphenopoly/"
    },
    setup: {
        selectors: {
            ".content": {}
        }
    }
});

var currentYear = new Date().getFullYear();
var yearStr = '2022 - ' + currentYear;
if (currentYear === 2022) {
    yearStr = '2022';
}
$('.footer').html('&copy; Vitalii Vovk, ' + yearStr);

function showAnsw() {
    if (document.getElementById('show-answ').checked) {
        $('details').attr('open', true);
    }
    else {
        $('details').attr('open', false);
    }
}

function nextCard() {
    if (currentCard < countCard) currentCard++; else currentCard = countCard;
    $('body').attr('card', currentCard);
    getCard();
}

function prevCard() {
    if (currentCard >= 1) currentCard--; else currentCard = 0;
    $('body').attr('card', currentCard);
    getCard(); 
}

function getCard(){
    if (parseInt($('body').attr('count')) === 0) {
        countCard = DataQ.length -1;
        $('body').attr('count', countCard);
    }
    currentCard = parseInt($('body').attr('card'));
    var ttl = '';
    var icn = '';
    $.each(docs, (i) => {
        $.each(docs[i], (k,v) => {
            if (k === $('body').attr('id')) {
                ttl = v[0];
                icn = v[2];
            }
        });
    });
    $('title').text('ExaM. ' + ttl);
    $('#chapter-id').text(ttl);
    $('.active-chapter-icon').attr('class', icn + ' active-chapter-icon');
    $('li > a').attr('class', '');
    $('main.content').empty();
    $('main.content').append('<div class="card-hdr">\
            <h2 id="title">' + ttl + '</h2>\
            <h2 id="card">' + (currentCard + 1) + '&nbsp;из&nbsp;' + (countCard+1) + '</h2>\
        </div>');
    $.each(DataQ[currentCard], (q) => {
        question = DataQ[currentCard][q];;
        let details = document.createElement("details");
        let summary = document.createElement("summary");
        summary.setAttribute('lang', 'ru');    
        summary.innerHTML = question['q'];
        let span = document.createElement("span");
        span.setAttribute('class', 'ntd');
        span.setAttribute('lang', 'ru');
        span.innerHTML = '<br>' + question['n'];
        summary.append(span);
        details.append(summary);
        let p = document.createElement('p');
        p.setAttribute('lang', 'ru');
        if (DataA.length === 0) {
            p.innerHTML = question['a'];
        }
        else {
            p.innerHTML = DataA[question['a']];
        }
        let div = document.createElement('div');
        div.setAttribute('class', 'answer');
        div.append(p);
        details.append(div);
        $('main.content').append(details);
    });
    window.scrollTo(0, 0);
    showAnsw();
    changeTheme();
}

function changeTheme() {
    var bg = 'var(--background)';
    var dt = 'var(--white)';
    var sum = '#000';
    var an = 'var(--answer-color)';
    var hdr = 'var(--color-akcent)';
    var achapt = 'var(--black)'

    if ($('#change-theme').prop('checked'))
    {
        bg = '#000';
        dt = 'var(--black)';
        sum = '#fff';
        an = 'var(--color-akcent)';
        hdr = dt;
        achapt = 'var(--color-akcent)'
    }
    $('body').css('background', bg);
    $('html').css('background', bg);
    $('.header').css('background', hdr);
    $('.footer').css('background', hdr);
    $('.footer').css('color', sum);
    $('.slider').css('background', achapt);
    $('details').css('background', dt);
    $('.elem').css('background', dt);
    $('summary').css('color', sum);
    $('.elem h2').css('color', sum);
    $('.answer').css('color', an);
    document.documentElement.style.setProperty('--a-hover-text', dt);
}

function setIndexContent() {
    $('li > a').attr('class', '');
    $.each(docs, (i) => {
        let col = document.createElement("div");
        col.setAttribute('class', 'col');
        $.each(docs[i], (k,v) => {
            let elem = document.createElement("div");
            elem.setAttribute('class', 'elem');
            let div = document.createElement("div");
            let a = document.createElement("a");
            a.setAttribute('class', v[2]);
            a.setAttribute('onclick', 'location.href="./pages/' + k + '.html";');
            div.append(a);
            elem.append(div);
            let h2 = document.createElement('h2');
            h2.innerHTML = v[0];
            elem.append(h2);
            let p = document.createElement('p');
            p.innerHTML = v[1];
            elem.append(p);
            col.append(elem);
        });
        $('div.row').append(col);
    });
}