var currentPage = '';
var currentDtQ = undefined;
var currentDtA = undefined;
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

function eb2(event) {
    currentCard = 0;
    currentPage = 'eb2';
    currentDtQ = eb2DataQ;
    currentDtA = ebDataA;
    getCard();
}

function eb3(event) {
    currentCard = 0;
    currentPage = 'eb3';
    currentDtQ = eb3DataQ;
    currentDtA = ebDataA;
    getCard();
}

function eb4(event) {
    currentCard = 0;
    currentPage = 'eb4';
    currentDtQ = eb4DataQ;
    currentDtA = ebDataA;
    getCard();
}

function eb5(event) {
    currentCard = 0;
    currentPage = 'eb5';
    currentDtQ = eb5DataQ;
    currentDtA = ebDataA;
    getCard();
}

function pprp(event) {
    currentCard = 0;
    currentPage = 'pprp';
    currentDtQ = pprpDataQ;
    currentDtA = pprpDataA;
    getCard();
}

function pte(event) {
    currentCard = 0;
    currentPage = 'pte';
    currentDtQ = pteDataQ;
    currentDtA = pteDataA;
    getCard();
}

function pb(event) {
    currentCard = 0;
    currentPage = 'pb';
    currentDtQ = pbDataQ;
    currentDtA = pbDataA;
    getCard();
}

function ot(event) {
    currentCard = 0;
    currentPage = 'ot';
    currentDtQ = otDataQ;
    currentDtA = otDataA;
    getCard();
}

function op(event) {
    currentCard = 0;
    currentPage = 'op';
    currentDtQ = opData;
    currentDtA = undefined;
    getCard();
}

function nds(event) {
    currentCard = 0;
    currentPage = 'nds';
    currentDtQ = ndsData;
    currentDtA = undefined;
    getCard();
}

function index(event) {
    setIndexContent();
    changeTheme();
}

function showAnsw(event) {
    if (document.getElementById('show-answ').checked) {
        $('details').attr('open', true);
    }
    else {
        $('details').attr('open', false);
    }
}

function nextCard(event) {
    if (currentCard < countCard) currentCard++; else currentCard = countCard;
    getCard();
}

function prevCard(event) {
    if (currentCard >= 1) currentCard--; else currentCard = 0;
    getCard(); 
}

function getCard(){
	$('label.no-index').css('display', 'unset');
    countCard = currentDtQ.length -1;
    var ttl = '';
    var icn = '';
    $.each(docs, (i) => {
        $.each(docs[i], (k,v) => {
            if (k === currentPage) {
                ttl = v[1];
                icn = v[2];
            }
        });
    });
    $('#chapter-id').text(ttl);
    $('.active-chapter-icon').attr('class', icn + ' active-chapter-icon');
    $('li > a').attr('class', '');
    $('main.content').empty();
    $('main.content').append('<div class="card-hdr">\
            <h2 id="title">' + ttl + '</h2>\
            <h2 id="card">' + (currentCard + 1) + '&nbsp;из&nbsp;' + (countCard+1) + '</h2>\
        </div>');
    $.each(currentDtQ[currentCard], (q) => {
        question = currentDtQ[currentCard][q];;
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
        if (currentDtA === undefined) {
            p.innerHTML = question['a'];
        }
        else {
            p.innerHTML = currentDtA[question['a']];
        }
        let div = document.createElement('div');
        div.setAttribute('class', 'answer');
        div.append(p);
        details.append(div);
        $('main.content').append(details);
    });
    window.scrollTo(0, 0);
    showAnsw();
    $('title').text('ExaM. ' + ttl);
    changeTheme();
}

function changeTheme() {
    var bg = 'var(--background)';
    var dt = 'var(--white)';
    var sum = '#000';
    var an = 'var(--answer-color)';
    var hdr = 'var(--color-akcent)';
    var achapt = 'var(--black)'

    if ($('#change-theme').is(':checked'))
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
	// hide next & prev card buttons
	$('label.no-index').css('display', 'none');
    // clear content and apply stylesheet
    $('li > a').attr('class', '');
    $('main.content').empty();
    $('title').text('EXAM. Самоподготовка.');
    $('#chapter-id').text('EXAM');
    $('.active-chapter-icon').attr('class', 'ri-home-2-fill active-chapter-icon');
    currentPage = 'index';
    // edit content
    $('main.content').append('\
        <h2 id="index-title">Контрольные вопросы и билеты для подготовки к сдаче экзаменов в ПДК ТЭЦ-14</h2>\
        <div id="center">\
            <div id="tbl">\
                <div class="row">\
                </div>\
            </div>\
        </div>');
    $.each(docs, (i) => {
        let col = document.createElement("div");
        col.setAttribute('class', 'col');
        $.each(docs[i], (k,v) => {
            let elem = document.createElement("div");
            elem.setAttribute('class', 'elem');
            let div = document.createElement("div");
            let a = document.createElement("a");
            a.setAttribute('class', v[2]);
            a.setAttribute('onclick', k + '(event);');
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