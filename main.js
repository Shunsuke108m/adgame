console.log("読み込み確認");

// アコーディオン
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion');
    const panels = document.querySelectorAll('.panel');

    accordions.forEach((accordion, index) => {
        accordion.addEventListener('click', () => {
            accordion.classList.toggle('active');
            const panel = panels[index];
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                accordion.textContent = accordion.textContent.replace("▼", "▶︎");
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                accordion.textContent = accordion.textContent.replace("▶︎", "▼");
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const descriptionTriggers = document.querySelectorAll('.description-trigger');
    const closeModalBtns = document.querySelectorAll('.js-close-button');
    const modal = document.getElementById('modalWk');

    descriptionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const description = trigger.getAttribute('data-description');
            if (description === "期間") {
                openDescriptionModal();
            }
        });
    });

    function openDescriptionModal() {
        modal.classList.add('is-open');
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('is-open');
        });
    });

    // モーダルの外側をクリックした時にモーダルを閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
        }
    });
});




// モーダル（アクションボタンの説明）
document.addEventListener('DOMContentLoaded', () => {
    const closeModalBtns = document.querySelectorAll('.js-close-button');
    const actionButtons = document.querySelectorAll('.actionBtnListDescription button');
    const executionBtn = document.querySelector('.executionBtnDescription');
    const visionBtn = document.getElementById('visionButton');
    const modals = document.querySelectorAll('.js-modal');
    const descriptionTriggers = document.querySelectorAll('.description-trigger');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('is-open');
        }
    }

    function closeModal() {
        modals.forEach(modal => modal.classList.remove('is-open'));
    }

    // 各アクションボタンに対するイベントリスナーの追加
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // モーダルを閉じるボタンに対するイベントリスナーの追加
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // モーダルの外側をクリックした時にモーダルを閉じる
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });

    // 実行ボタンでモーダルを開く
    executionBtn.addEventListener('click', () => {
        openModal('modalExecution');
    });

    // 説明トリガーでモーダルを開く
    descriptionTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const description = trigger.getAttribute('data-description');
            switch (description) {
                case '期間':
                    openModal('modalWk');
                    break;
                case 'COST':
                    openModal('modalCost');
                    break;
                case 'CPM':
                    openModal('modalCpm');
                    break;
                case 'IMP':
                    openModal('modalImp');
                    break;
                case 'CTR':
                    openModal('modalCtr');
                    break;
                case 'CVR':
                    openModal('modalCvr');
                    break;
                case 'CV':
                    openModal('modalCv');
                    break;
                case 'CPA':
                    openModal('modalCpa');
                    break;
                default:
                    console.log(`No modal found for ${description}`);
            }
        });
    });

    // Visionボタンでモーダルを開く
    visionBtn.addEventListener('click', () => {
        openModal('modalVision');
    });
});








// --------アクションボタンのクリック関連--------
// CR変更ボタンのカウント定義
let crClickCount = 0;
document.getElementById('CRBtn').addEventListener('click', actionButton);

// LP変更ボタンの処理
let lpClickCount = 0;
document.getElementById('LPBtn').addEventListener('click', actionButton);

// CPM変更ボタンの処理
let cpnClickCount = 0;
document.getElementById('CPNBtn').addEventListener('click', actionButton);

// 増額提案ボタンの処理
let increaseClickCount = 0;
document.getElementById('increaseBtn').addEventListener('click', actionButton);


// 増額提案が動かないからがんばる場所
// document.getElementById('increaseBtn').addEventListener('click', function() {
//     console.log('increaseBtn clicked');
//     actionButton.call(this);
// });


// ボタンのクリックごとにONとOFFを切り替える
function actionButton() {
    switch (this.id) {
        case 'CPNBtn':
            cpnClickCount++;
            break;
        case 'CRBtn':
            crClickCount++;
            break;
        case 'LPBtn':
            lpClickCount++;
            break;
        case 'increaseBtn':
            increaseClickCount++;
            break;
        default:
            console.log('Invalid button');
    }

    if (this.classList.contains('on')) {
        this.classList.remove('on');
    } else {
        this.classList.add('on');
    }
    console.log('Class toggled:', this.classList.contains('on'));
}


// 実行ボタンを押されるとボタンをONではなくして次のターンにする
// document.querySelector('.executionBtn').addEventListener('click', function() {
//     if (cpnClickCount % 2 !== 0) {
//         changeCP();
//         document.getElementById('CPNBtn').classList.remove('on');
//         cpnClickCount = 0;
//     }
//     if (crClickCount % 2 !== 0) {
//         changeCR();
//         document.getElementById('CRBtn').classList.remove('on');
//         crClickCount = 0;
//     }
//     if (lpClickCount % 2 !== 0) {
//         changeLP();
//         document.getElementById('LPBtn').classList.remove('on');
//         lpClickCount = 0;
//     }
//     if (increaseClickCount % 2 !== 0) {
//         changeCost();
//         document.getElementById('increaseBtn').classList.remove('on');
//         increaseClickCount = 0;
//     }
// });



// --------アクションボタンによる数値変動関連--------
    // changeCRなどを実行しないとcurrentCtrValueが定義づけられないのをGPTになんとかしてもらったコード
let currentCtrValue = null;
let currentCvrValue = null;
let currentCpmValue = null;
let currentCostValue = null;
let currentCpaValue = null;
let currentCashValue = null;
let cashChange = 0;

function initializeValues() {
    currentCtrValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .ctrValue').innerText.replace('%', ''));
    currentCvrValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cvrValue').innerText.replace('%', ''));
    currentCpmValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cpmValue').innerText.replace(/¥|,/g, ''));
    currentCostValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .costValue').innerText.replace(/[¥,]/g, ''));
    currentCpaValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cpaValue').innerText.replace(/[¥,]/g, ''));
    currentCashValue = parseFloat(document.getElementById('cashValue').innerText.replace(/[¥,]/g, ''));

    console.log('Initial currentCtrValue:', currentCtrValue);
    console.log('Initial currentCvrValue:', currentCvrValue);
    console.log('Initial currentCpmValue:', currentCpmValue);
    console.log('Initial currentCostValue:', currentCostValue);
    console.log('Initial currentCpaValue:', currentCpaValue);
    console.log('Initial currentCashValue:', currentCashValue);
}
initializeValues()

// CRを変更する関数
let newCtrValue
let newCtr
// let currentCtrValue
function changeCR() {
    // .resultTable tr:nth-child(2) .ctrValue（＝2行目のctr）のテキストを取得し、パーセンテージ記号を取り除いて数値に変換
    currentCtrValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .ctrValue').innerText.replace('%', ''));
    console.log('currentCtrValue:', currentCtrValue);

    // ctrの元の値ごとに変動する数字を定義
    let randomMultiplierCtr;
    if (currentCtrValue >= 1.2) {
        randomMultiplierCtr = (Math.random() * 0.75) + 0.5; // 0.5から1.25の範囲
    } else if (currentCtrValue >= 0.6) {
        randomMultiplierCtr = (Math.random() * 0.75) + 0.75; // 0.75から1.5の範囲
    } else {
        randomMultiplierCtr = (Math.random() * 1.0) + 1.0; // 1.0から2.0の範囲
    }

    // currentCTRにランダムな値を掛けて新しいCTRを計算
    newCtrValue = currentCtrValue * randomMultiplierCtr;

    // // 新しいCTRを小数点以下2桁までのパーセンテージとして表示（多分これのせいで書き換わってる）→消したら行けた
    // document.querySelector('.adResultTable tr:nth-child(2) .ctrValue').innerText = newCtrValue.toFixed(2) + '%';

    newCtr = newCtrValue.toFixed(2) + '%';

    cashChange -= 50000;
    console.log('CR変更後のCashChange', cashChange)
}

// LPを変更する関数
let newCvrValue
let newCvr
// let currentCvrValue
function changeLP() {
    
    currentCvrValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cvrValue').innerText.replace('%', ''));

    // cvrの元の値ごとに変動する数字を定義
    let randomMultiplierCvr;
    if (currentCvrValue >= 3) {
        randomMultiplierCvr = (Math.random() * 0.75) + 0.5; // 0.5から1.25の範囲
    } else if (currentCvrValue >= 1.5) {
        randomMultiplierCvr = (Math.random() * 0.75) + 0.75; // 0.75から1.5の範囲
    } else {
        randomMultiplierCvr = (Math.random() * 1.0) + 1.0; // 1.0から2.0の範囲
    }

    // currentCTRにランダムな値を掛けて新しいCTRを計算
    newCvrValue = currentCvrValue * randomMultiplierCvr;

    newCvr = newCvrValue.toFixed(2) + '%';
    console.log('newCvr:', newCvr);
    console.log('newCtrValue:', newCtrValue);

    cashChange -= 500000;
    console.log('LP変更後のCashChange', cashChange)
}

// CPを変更する関数
let newCpmValue
let newCpm
// let currentCpmValue
function changeCP() {

    currentCpmValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cpmValue').innerText.replace(/[¥,]/g, ''));

    let randomMultiplierCpm;
    if (currentCpmValue >= 6000) {
        randomMultiplierCpm = (Math.random() * 0.3) + 0.5; // 0.5から0.8の範囲
    } else if (currentCpmValue >= 3000) {
        randomMultiplierCpm = (Math.random() * 0.75) + 0.5; // 0.5から1.25の範囲
    } else if (currentCpmValue >= 2000) {
        randomMultiplierCpm = (Math.random() * 0.75) + 0.75; // 0.75から1.5の範囲
    } else {
        randomMultiplierCpm = (Math.random() * 1.0) + 1.0; // 1.0から2.0の範囲
    }
    

    newCpmValue = currentCpmValue * randomMultiplierCpm;

    newCpm = '¥' + Math.round(newCpmValue);
    console.log('newCpm:', newCpm);
    console.log('newCpmValue:', newCpmValue);
}

// Costを変更する関数
let newCostValue
let newCost
function changeCost() {

    currentCostValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .costValue').innerText.replace(/[¥,]/g, ''));
    currentCpaValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cpaValue').innerText.replace(/[¥,]/g, ''));
    let tCpaValue = parseFloat(document.getElementById('tCpa').innerText.replace(/[¥,]/g, ''));

    currentCtrValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .ctrValue').innerText.replace('%', ''));
    currentCvrValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cvrValue').innerText.replace('%', ''));
    currentCpmValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cpmValue').innerText.replace(/[¥,]/g, ''));

    console.log('changeCost実行時のcurrentCostValue:', currentCostValue);
    console.log('changeCost実行時のtCpa:', tCpaValue);
    console.log('changeCost実行時のcurrentCpaValue:', currentCpaValue);
    if (currentCpaValue < tCpaValue) {
        newCostValue = currentCostValue * 1.2;
        console.log('New Cost Value:', newCostValue);

        let randomMultiplierCtrIncrease = (Math.random() * 0.25) + 0.75;
        newCtrValue = currentCtrValue * randomMultiplierCtrIncrease;
        newCtr = newCtrValue.toFixed(2) + '%';

        let randomMultiplierCvrIncrease = (Math.random() * 0.25) + 0.75;
        newCvrValue = currentCvrValue * randomMultiplierCvrIncrease;
        newCvr = newCvrValue.toFixed(2) + '%';

        let randomMultiplierCpmIncrease = (Math.random() * 0.25) + 1.0;
        newCpmValue = currentCpmValue * randomMultiplierCpmIncrease;
        newCpm = '¥' + Math.round(newCpmValue);
        console.log("増額提案前のCPM", currentCpmValue);
        console.log("増額提案後のCPMの変動値", randomMultiplierCpmIncrease);
        console.log("増額提案後のCPM", newCpmValue);

    } else {
        newCostValue = currentCostValue
        console.log('増額提案失敗時のNew Cost Value:', newCostValue);
    }

    newCost = '¥' + Math.round(newCostValue);
}



///////////////////////////////////

// --------実行ボタン関連--------

// 新しい週のwk◯◯の定義
let newWeek 
let currentWeek
function updateWeekValue() {
    var periodElement = document.querySelector('.adResultTable tr:nth-child(2) td:first-child');
    var currentPeriod = periodElement.innerText;
    var match = currentPeriod.match(/wk(\d+)/);
    currentWeek = parseInt(match[1]);
    newWeek = currentWeek + 1;
    // periodElement.innerText = 'wk' + newWeek;　→これも原因だった！
}


// テーブルの更新
function updateResultTable() {

    // 紐づく数値を変える
         // IMPとCPMの計算
    // let currentCostText = document.querySelector('.adResultTable tr:nth-child(2) .costValue').innerText;
    // let currentCost = parseFloat(currentCostText.replace(/¥|,/g, ''));
    // console.log(currentCost);
    
            // newCpmValueが空かどうかをチェック
    if (!newCpmValue) {
                // newCpmValueが空の場合、adResultTableの2行目のcpmValueを使用
        let cpmValueText = document.querySelector('.adResultTable tr:nth-child(2) .cpmValue').innerText;
        newCpmValue = parseFloat(cpmValueText.replace(/¥|,/g, ''));
    }
    
    console.log(newCpmValue);
    
             // newImpを計算
    let newImp = Math.round(currentCostValue / newCpmValue * 1000);
    console.log('newImp',newImp);
    console.log('currentCostValue',currentCostValue);
    

    // CV数を計算
    let currentImpValue = document.querySelector('.adResultTable tr:nth-child(2) .impValue').innerText;
    let effectiveImpValue = newImp || currentImpValue;
    let effectiveCtrValue = newCtrValue || currentCtrValue;
    console.log('CPA計算のcurrentCtrValue:', currentCtrValue);
    let effectiveCvrValue = newCvrValue || currentCvrValue;
    console.log('CPA計算のcurrentCvrValue:', currentCvrValue);
    let newCv = Math.round(effectiveImpValue * effectiveCtrValue * effectiveCvrValue * 0.0001);
    console.log('newCv:', newCv);


    // CPA を計算
    let newCpa = Math.round(currentCostValue / newCv);

    // 選択されなかった場合には既存の数値を取得するための動き
    let costValue = newCost;
    if (!costValue) {
        costValue = document.querySelector('.adResultTable tr:nth-child(2) .costValue').innerText;
    }

    let cpmValue = newCpm;
    if (!cpmValue) {
        cpmValue = document.querySelector('.adResultTable tr:nth-child(2) .cpmValue').innerText;
    }

    let impValue = newImp;
    if (!impValue) {
        impValue = document.querySelector('.adResultTable tr:nth-child(2) .impValue').innerText;
    }

    let ctrValue = newCtr;
    if (!ctrValue) {
        ctrValue = document.querySelector('.adResultTable tr:nth-child(2) .ctrValue').innerText;
    }

    let cvrValue = newCvr;
    if (!cvrValue) {
        cvrValue = document.querySelector('.adResultTable tr:nth-child(2) .cvrValue').innerText;
    }

    let cvValue = newCv;
    if (!cvValue) {
        cvValue = document.querySelector('.adResultTable tr:nth-child(2) .cvValue').innerText;
    }

    let cpaValue = newCpa;
    if (!cpaValue) {
        cpaValue = document.querySelector('.adResultTable tr:nth-child(2) .cpaValue').innerText;
    }


    // 行を作成
    let newRow = document.createElement('tr');
    newRow.classList.add('adResultValue', 'wk' + newWeek);
    newRow.innerHTML = `
        <td>wk${newWeek}</td>
        <td class="costValue">${costValue}</td>
        <td class="cpmValue">${cpmValue}</td> 
        <td class="impValue">${newImp}</td> 
        <td class="ctrValue">${ctrValue}</td> 
        <td class="cvrValue">${cvrValue}</td> 
        <td class="cvValue">${cvValue}</td> 
        <td class="cpaValue">${cpaValue}</td> 
    `;

    var tableBody = document.querySelector('.adResultTable');
    var secondRow = tableBody.querySelector('tr:nth-child(2)'); // 2番目の行を取得
    tableBody.insertBefore(newRow, secondRow); // 新しい行を2番目の行の直前に挿入
}

// 実行ボタンのクリックイベントで結果テーブルを更新
document.querySelector('.executionBtn').addEventListener('click', function() {
    let turnCountElement = document.getElementById('turnCount');
    let turnCount = parseInt(turnCountElement.innerText);

    // 残りターン数が0のときの処理
    if (turnCount === 0) {
        openGameResultModal();
        return;
    }

    // キャッシュがゼロ以下の場合、ゲームオーバーモーダルを立ち上げる
    if (currentCashValue <= 0) {
        openModal('modalGameOver');
        return;
    }

    updateWeekValue();

    // CR変更、LP変更、CPN変更、予算増額のいずれも選択されていない場合
    if (!document.getElementById('CRBtn').classList.contains('on') &&
        !document.getElementById('LPBtn').classList.contains('on') &&
        !document.getElementById('CPNBtn').classList.contains('on') &&
        !document.getElementById('increaseBtn').classList.contains('on')) {

        console.log(!document.getElementById('CRBtn').classList.contains('on'));
        console.log(!document.getElementById('LPBtn').classList.contains('on'));
        console.log(!document.getElementById('CPNBtn').classList.contains('on'));
        console.log(!document.getElementById('increaseBtn').classList.contains('on'));
        console.log(document.getElementById('CPNBtn'));
        
        

        // CTR、CVR、CPMを0%から20%の範囲でランダムに改善させる
        currentCtrValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .ctrValue').innerText.replace('%', ''));
        currentCvrValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cvrValue').innerText.replace('%', ''));
        currentCpmValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cpmValue').innerText.replace(/¥|,/g, ''));

        let ctrImprovement = (Math.random() * 0.05) + 1.0; // 1.0 から 1.05 の範囲
        let cvrImprovement = (Math.random() * 0.05) + 1.0; // 1.0 から 1.05 の範囲
        let cpmImprovement = (Math.random() * 0.05) + 0.95; // 0.95 から 1.0 の範囲

        newCtrValue = currentCtrValue * ctrImprovement;
        newCvrValue = currentCvrValue * cvrImprovement;
        newCpmValue = currentCpmValue * cpmImprovement;

        newCtr = newCtrValue.toFixed(2) + '%';
        newCvr = newCvrValue.toFixed(2) + '%';
        newCpm = '¥' + Math.round(newCpmValue);

        console.log('CTR, CVR, CPM improved by random percentage up to 20%');
    } else {
        if (document.getElementById('CRBtn').classList.contains('on')) {
            console.log('changeCR is called');
            changeCR();
        }
        if (document.getElementById('LPBtn').classList.contains('on')) {
            console.log('changeLP is called');
            changeLP();
        }
        if (document.getElementById('CPNBtn').classList.contains('on')) {
            console.log('changeCP is called');
            changeCP();
        }
        if (document.getElementById('increaseBtn').classList.contains('on')) {
            console.log('changeCost is called');
            changeCost();
        }
    }

    currentCostValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .costValue').innerText.replace(/[¥,]/g, ''));
    cashChange -= currentCostValue;
    currentCvValue = parseFloat(document.querySelector('.adResultTable tr:nth-child(2) .cvValue').innerText.replace(/[¥,]/g, ''));
    cashChange += currentCvValue * 20000;
    console.log('計算直前のCashChange', cashChange);

    currentCashValue += cashChange;
    console.log('最終的なCashValue', currentCashValue);
    console.log('計算後のCashChange', cashChange);
    cashChange = 0;

    updateResultTable();

    let cashValue = currentCashValue.toLocaleString();
    let cashValueCell = document.getElementById('cashValue');
    cashValueCell.innerText = '¥' + cashValue;

    // 残りターン数を減らす
    if (turnCount > 0) {
        turnCount -= 1;
        turnCountElement.innerText = turnCount;
    }


    // 残りターン数が0になったらmodalGameResultモーダルを立ち上げる
    if (turnCount === 0) {
        openGameResultModal();
    }
   
    // 実行ボタンを押されるとonになってたやつを消す
    // changeCRとかが「学習」と重複してたから消した
    if (cpnClickCount % 2 !== 0) {
        document.getElementById('CPNBtn').classList.remove('on');
        cpnClickCount = 0;
    }
    if (crClickCount % 2 !== 0) {
        document.getElementById('CRBtn').classList.remove('on');
        crClickCount = 0;
    }
    if (lpClickCount % 2 !== 0) {
        document.getElementById('LPBtn').classList.remove('on');
        lpClickCount = 0;
    }
    if (increaseClickCount % 2 !== 0) {
        document.getElementById('increaseBtn').classList.remove('on');
        increaseClickCount = 0;
    }

});




function openGameResultModal() {
    // テーブルの2行目のCOSTとCVを取得してモーダルに表示する
    let finalCost = document.querySelector('.adResultTable tr:nth-child(2) .costValue').innerText;
    let finalCv = document.querySelector('.adResultTable tr:nth-child(2) .cvValue').innerText;
    let finalCashValue = document.getElementById('cashValue').innerText;

    document.getElementById('finalCost').innerText = finalCost;
    document.getElementById('finalCv').innerText = finalCv;
    document.getElementById('finalCashValue').innerText = finalCashValue;

    openModal('modalGameResult');
}

// function openGameOverModal() {
//     let finalCost = document.querySelector('.adResultTable tr:nth-child(2) .costValue').innerText;
//     let finalCv = document.querySelector('.adResultTable tr:nth-child(2) .cvValue').innerText;
//     let finalCashValue = document.getElementById('cashValue').innerText;

//     document.getElementById('finalCostGameOver').innerText = finalCost;
//     document.getElementById('finalCvGameOver').innerText = finalCv;
//     document.getElementById('finalCashValueGameOver').innerText = finalCashValue;

//     openModal('modalGameOver');
// }

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('is-open');
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.js-modal');
    modals.forEach(modal => modal.classList.remove('is-open'));
}

document.querySelectorAll('.js-close-button').forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// モーダルの外側をクリックした時にモーダルを閉じる
document.querySelectorAll('.js-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});




// アクションリストのクリックイベント
let actionList = [];
document.querySelectorAll('.actionList li').forEach((action) => {
    action.addEventListener('click', function() {
        if (actionList.includes(action.id)) {
            actionList = actionList.filter(item => item !== action.id);
            action.classList.remove('on');
        } else {
            actionList.push(action.id);
            action.classList.add('on');
        }
    });
});


// ヒントカラーの実装
document.addEventListener('DOMContentLoaded', () => {
    // Function to update the background color based on CTR, CVR, and CPM values
    function updateBackgroundColor(row) {
        const ctrCell = row.querySelector('.ctrValue');
        const cvrCell = row.querySelector('.cvrValue');
        const cpmCell = row.querySelector('.cpmValue');

        if (ctrCell) {
            const ctrValue = parseFloat(ctrCell.textContent.replace('%', ''));
            if (ctrValue <= 0.6) {
                ctrCell.style.backgroundColor = '#FFA8A8';
            } else if (ctrValue > 0.6 && ctrValue <= 1.2) {
                ctrCell.style.backgroundColor = '#FFE6E6';
            } else {
                ctrCell.style.backgroundColor = ''; // Reset to default
            }
        }

        if (cvrCell) {
            const cvrValue = parseFloat(cvrCell.textContent.replace('%', ''));
            if (cvrValue <= 1.5) {
                cvrCell.style.backgroundColor = '#FFA8A8';
            } else if (cvrValue > 1.5 && cvrValue <= 3) {
                cvrCell.style.backgroundColor = '#FFE6E6';
            } else {
                cvrCell.style.backgroundColor = ''; // Reset to default
            }
        }

        if (cpmCell) {
            const cpmValue = parseFloat(cpmCell.textContent.replace('¥', '').replace(',', ''));
            if (cpmValue >= 6000) {
                cpmCell.style.backgroundColor = '#FF5F5F';
            } else if (cpmValue >= 5000 && cpmValue < 7500) {
                cpmCell.style.backgroundColor = '#FFA8A8';
            } else if (cpmValue >= 3000 && cpmValue < 5000) {
                cpmCell.style.backgroundColor = '#FFE6E6';
            } else {
                cpmCell.style.backgroundColor = ''; // Reset to default
            }
        }
    }

    // Initial update for existing rows
    const rows = document.querySelectorAll('.adResultValue');
    rows.forEach(row => updateBackgroundColor(row));

    // Set up MutationObserver to watch for new rows
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('adResultValue')) {
                    updateBackgroundColor(node);
                }
            });
        });
    });

    const config = { childList: true, subtree: true };
    const target = document.querySelector('.adResultTable');
    observer.observe(target, config);
});

// リトライボタン
document.querySelectorAll('.retryBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        location.reload(); // ページをリロードする
    });
});


// function updateResultTable() {
//     let newRow = document.createElement('tr');
//     newRow.classList.add('resultValueWk' + newWeek);
//     newRow.innerHTML = `
//         <td>wk${newWeek}</td>
//         <td id="costValueWk${newWeek}">${document.getElementById('costValueWk1').innerText}</td>
//         <td id="cpmValueWk${newWeek}">${document.getElementById('cpmValueWk1').innerText}</td>
//         <td id="impValueWk${newWeek}">${document.getElementById('impValueWk1').innerText}</td>
//         <td id="ctrValueWk${newWeek}">${document.getElementById('ctrValueWk1').innerText}</td> 
//         <td id="cvrValueWk${newWeek}">${document.getElementById('cvrValueWk1').innerText}</td>
//         <td id="cvValueWk${newWeek}">${document.getElementById('cvValueWk1').innerText}</td>
//         <td id="cpaValueWk${newWeek}">${document.getElementById('cpaValueWk1').innerText}</td>
//     `;

//     var tableBody = document.querySelector('.resultTable');
//     var lastRow = tableBody.querySelector('tr:last-child'); // 最も古い行を取得
//     tableBody.insertBefore(newRow, lastRow.nextSibling); // 新しい行を最も古い行の直後に挿入
// }


// function updateResultTable() {
//     let newRow = document.createElement('tr');
//     newRow.classList.add('resultValueWk' + newWeek);
//     newRow.innerHTML = `
//         <td>wk${newWeek}</td>
//         <td id="ctrValueWk${newWeek}">newCtrValue</td> 
//     `;

//     var tableBody = document.querySelector('.resultTable');
//     var lastRow = tableBody.querySelector('tr:last-child'); // 最も古い行を取得
//     tableBody.insertBefore(newRow, lastRow.nextSibling); // 新しい行を最も古い行の直後に挿入
// }