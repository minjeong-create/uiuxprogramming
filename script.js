const serviceName = "study";
let isSubscribed = false;
let submitCount = 0;

function makeSubscribeMessage(email, subscribe) {
    if (subscribe == true) {
        return email + "로 구독이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscribeEmail = emailInput.value.trim();

    if (subscribeEmail === "") {
        subscribeMessage.textContent = 
            "학습 소식 구독을 신청하시려면 이메일을 입력해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent = 
    makeSubscribeMessage(subscribeEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "구독 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agreeCheck");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick(event) {
    const isDark = document.body.classList.toggle("dark");

    themeButton.textContent = isDark ? "라이트 모드로 변경" : "다크 모드로 변경";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput(event) {
    const maxLength = nicknameInput.maxLength;
    const currentLength = Math.min(nicknameInput.value.length, maxLength);
    
    nicknameCount.textContent = currentLength + " / " + maxLength;
}

nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
    const agreed = agreeCheck.checked;

    startButton.disabled = !agreed;
    agreeMessage.textContent = agreed
         ? "학습 시작하기" 
         : "시작하려면 약관에 동의해야 합니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else {
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels() {
    tabs.forEach(function(tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });
    panels.forEach(function(panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}

function activateTab(clickedTab) {
    const targetSelector = "#" + clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function(tab) {
    tab.addEventListener("click", handleTabClick);
});

const trainingFlow = document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress__item");
const titleInput = document.querySelector("#studentName");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");
const durationValues = ["3", "5", "10"];

const formData = {
    title:"", duration: "5", qna: false, qnaCount: "2"
};

function showStep(index) {
    flowSteps.forEach((step, i) => {step.hidden = i !== index;});
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });
}

const infoDialog = document.querySelector("#infoDialog");
const infoCancel = document.querySelector("#info-cancel");
const infoConfirm = document.querySelector("#info-confirm");

function revokeinfoAgreement(){
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    infoDialog.showModal();
});
infoCancel.addEventListener("click", () => {
    infoDialog.close();
    revokeinfoAgreement();
});
infoDialog.addEventListener("cancel", revokeinfoAgreement);
infoConfirm.addEventListener("click", () => {
    if (!agreeCheck.checked) return;
    infoDialog.close();
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({behavior: "smooth"});
    titleInput.focus();
});

function validateTitle() {
    const value = titleInput.value.trim();
    if (!value) {
        titleError.textContent = "학습자 이름을 입력해 주세요.";
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", () => {
    if(!validateTitle()) return;
    showStep(1);
});

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value] + "시간";
});

qnaOption.addEventListener("change", () => {
    qnaOptions.hidden = !qnaOption.checked;
});

optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked;
const count = document.querySelector('input[name="qna-count"]:checked');
if (count) {
    formData.qnaCount = count.value;}
    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration + "시간";
    summaryQna.textContent = formData.qna ? formData.qnaCount + "개 포함" : "미포함";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => showStep(3));
restartButton.addEventListener("click", () => {
    formData.title = "";
    formData.duration = "";
    formData.qna = false;
    formData.qnaCount = "2";
    titleInput.value = "";
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    durationRange.value = "1";
    durationValue.value = "5시간";
    qnaOption.checked = false;
    qnaOptions.hidden = true;
    document.querySelector('input[name="qna-count"][value="2"]').checked = true;
    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent = "";
    showStep(0);
});