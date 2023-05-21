var pageParams = {
    'dark'    : getUrlParam('dark', undefined),
    'section' : getUrlParam('section', undefined),
    'chapter' : getUrlParam('chapter', undefined),
    'company' : getUrlParam('company', undefined),
};

let config;
async function fetchConfig() {
    try {
        const response = await fetch('./static/config.json');
        config = await response.json();
    } catch(e) {
        console.error(`[fetchConfig] code: ${e.status}; message: ${e.responseText}`);
    }
}

let companyConfig;
let companyConfigPath;
async function fetchCompanyConfig() {
    try {
        companyConfigPath = config.find(e => e['id'] ==  pageParams['company'])['data'];
        companyConfig = await $.getJSON(companyConfigPath + '/config.json');
    } catch(e) {
        console.error(`[fetchCompanyConfig] code: ${e.status}; message: ${e.responseText}`);
    }
}

let sectionData;
async function fetchSectionData(yamlName) {
    try {
        const response = await $.get(companyConfigPath  + '/' + yamlName + '.yaml');
        sectionData = await jsyaml.load(response);
    } catch(e) {
        console.error(`[fetchSectionData] code: ${e.status}; message: ${e.responseText}`);
    }
}

let sectionObj;

$(document).ready(() => {

    $('#theme>input').prop('checked', pageParams['dark'] == '1');
    changeTheme();

    Hyphenopoly.config({
        require: {
            "ru": "электротехнологический"
        },
        paths: {
            patterndir: "./static/lib/hyphenopoly/patterns/",
            maindir: "./static/lib/hyphenopoly/"
        },
        setup: {
            selectors: {
                ".content": {}
            }
        }
    });

    $('.author').html('&copy; Vitalii Vovk, ' + new Date().getFullYear());

    $('.navigator-container').css('display', pageParams['section'] == undefined ? 'none' : 'inline-block');

    document.addEventListener("fullscreenchange", () => {
        $('#screen>svg>use').attr('xlink:href', document.fullscreenElement ? '#ri-fullscreen-exit-fill' : '#ri-fullscreen-fill'); 
    });
    
    if (pageParams['company'] == undefined) {
        fetchConfig().then(printCompanyMenu);        
    } else {
        $('#btn-home').on("click", () => {
            location.href = ".?company=" + pageParams['company'];
        });
        fetchConfig().then(() => {
            fetchCompanyConfig().then(() => {
                if (pageParams['section'] == undefined) {
                    printSectionsPage();
                } else {
                    const chapter = companyConfig.find(e => e['id'] == pageParams['chapter']);
                    sectionObj = chapter['items'].find(e => e['id'] == pageParams['section']);
                    var yamlName = sectionObj['data'] == null ? pageParams['section'] : sectionObj['data'];
                    fetchSectionData(yamlName).then(printChapterPage);
                }
            });
        });
    }
});

function getUrlParam(parameter, defaultvalue){
    var urlparam = (window.location.href.indexOf(parameter) >- 1) ? getUrlVars()[parameter] : defaultvalue;
    return (urlparam !== undefined) ? urlparam : defaultvalue;
}

function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getCompanyItem(companyJsonObj) {
    let elem = Object.assign(document.createElement("div"),{
        className: 'elem',
        innerHTML: '<svg class="ri-icn-card"><use xlink:href="#ma-apartment"></use></svg><h2>' + companyJsonObj['name'] + '</h2><p>' + companyJsonObj['description'] + '</p>'
    });
    elem.setAttribute('files', companyJsonObj['files']);
    elem.addEventListener("click", (event) => {
        location.href = ".?company=" + companyJsonObj['id'];
    }, false);
    return elem;
}

function renderTable(items, table_id) {
    var rows = [];
    for (var i=0; i < items.length; i++) {
        if (i % 3 == 0) {
            rows.push([]);
        };
        rows[rows.length - 1].push(items[i]);
    }
    rows.forEach(cells => {
        let row = Object.assign(document.createElement('div'), {className: 'row'});
        cells.forEach(cell => {
            row.append(cell);
        });
        if (table_id == undefined) {
            $('.center').append(cells);
        } else {
            $('.' + table_id).append(cells);
        }
    });
}

function printCompanyMenu() {
    $('div.center').before('<h2 class="tbl-title" style="margin-bottom: 1rem;">Материалы для самоподготовки к аттестации в комиссии ТЭЦ</br></br>ПАО "ТГК-1" филиал "Невский"</h2>');
    var compArray = [];
    config.forEach(company => {
        compArray.push(getCompanyItem(company));
    });
    renderTable(compArray);
}

function getBlockItem(chapterId, blockJsonObj) {
    let elem = Object.assign(document.createElement("div"),{
        className: 'elem',
        innerHTML: '<svg class="ri-icn-card"><use xlink:href="' + blockJsonObj['icon'] + '"></use></svg><h2>' + blockJsonObj['name'] + '</h2><p>' + blockJsonObj['description'] + '</p>'
    });
    elem.setAttribute('chapter', chapterId);
    elem.addEventListener("click", () => {
        location.href = ".?company=" + pageParams['company'] + '&chapter=' + chapterId + '&section=' + blockJsonObj['id'];
    }, false);
    return elem;
}

function printSectionsPage() {
    var company = config.find(e => e['id'] == pageParams['company']);  
    $('title').text('EXAM. ' + company['description']);
    $('.active-chapter>svg>use').attr('xlink:href','#ri-home-2-fill');
    $('div.content').before('\
        <div class="company-title-container">\
            <svg class="ri-icn" onclick="location.href=\'.\';"><use xlink:href="#arrow_back"></use></svg>\
            <div><h2 class="company-title" onclick="location.href=\'.\';">' + company['description'] + '</h2></div>\
        </div>');
    companyConfig.forEach(chapter => {
        $('div.content').append('\
            <div class="section">\
                <h2 class="tbl-title">' + chapter['title'] + '</h2>\
                <div class="center">\
                    <div class="tbl ' + chapter['id'] + '">\
                    </div>\
                </div>\
            </div>');
        var items = [];
        chapter['items'].forEach(item => {
            items.push(getBlockItem(chapter['id'], item));
        });
        renderTable(items, chapter['id']);
    });
    changeTheme();
}

function changeTheme() {
    $('body').attr('dark', $('#theme>input').prop('checked') ? '1' : '0');
    $('#theme>svg>use').attr('xlink:href', $('body').attr('dark')=="1" ? '#light_mode' : '#dark_mode');
}

function showAnswers() {
    $('#answer>svg>use').attr('xlink:href', $('#answer>input').prop('checked') ? '#ri-eye-off-fill' : '#ri-eye-fill');
    $('details').attr('open', $('#answer>input').prop('checked') ? true : false);
}

function fullScreen() {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
}

function nextCard() {
    $('body').attr('card', (currentCard < countCard) ? currentCard + 1 : countCard);
    getCard();
}

function prevCard() {
    $('body').attr('card', (currentCard >= 1) ? currentCard - 1 : 0);
    getCard(); 
}

function printChapterPage() {
    $('body').attr('card', 0);  
    let div = Object.assign(document.createElement("div"),{
        className:'card-hdr'
    });
    div.append(
        Object.assign(document.createElement("h2"),{
            id: 'title',
            innerHTML: sectionObj['description'] + ' (' + sectionObj['name'] + ')'
        })
    );
    $('div.content').before(div);
    getCard();
}

function formatAnswerForHtml(answer) {
    var result = [];
    answer.split('\n').forEach(e => {
        result.push('<p>' + e + '</p>');
    });
    return result.join('');
}

function getCard(){
    currentCard = parseInt($('body').attr('card'));

    var ttl = sectionObj['name'];
    $('title').text('ExaM. ' + ttl);
    $('#chapter-id').text(ttl);

    $('li > a').attr('class', '');
    $('div.content').empty();

    if (parseInt($('body').attr('count')) === 0) {
        countCard = sectionData[pageParams['section']]['cards'].length -1;
        $('body').attr('count', countCard);
    }

    $('.current-card-number').html((currentCard+1) + '&nbsp;/&nbsp;' + (countCard+1));

    var DataQ = sectionData[pageParams['section']]['cards'][currentCard]['c'];
    DataQ.forEach(question => {
        let summary = Object.assign(document.createElement("summary"),{
            lang: 'ru',
            innerHTML: question['q']['q']
        });
        if (question['q']['n'] != null) {
            summary.append(Object.assign(document.createElement("span"),{
                className: 'ntd',
                lang: 'ru',
                innerHTML: '<br>' + question['q']['n']
            }));
        }
        let div = Object.assign(document.createElement('div'), {
            className: 'answer'
        });
        div.append(Object.assign(document.createElement('p'), {
            lang: 'ru',
            innerHTML: formatAnswerForHtml(question['q']['a'])
        }));
        let details = document.createElement("details");
        details.append(summary, div);
        $('div.content').append(details);
    });
    window.scrollTo(0,0);
    showAnswers();
}
