
const serviceName = "study";
const storageKey = "studymate-records-v1";

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
const titleField = document.querySelector("#title-field");
const titleHelp = document.querySelector("#title-help");
const titleCount = document.querySelector("#title-count");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const qnaCountInputs = [...document.querySelectorAll('input[name="qna-count"]')];
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const form = document.querySelector("#plan-form");
const saveButton = document.querySelector("#finish-button");
const submitStatus = document.querySelector("#submit-status");
const forceSaveFailure = new URLSearchParams(location.search).has("save-error");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna");
const durationValues = ["3", "5", "10"];

const formData = {
    title: "",
    duration: "5",
    qna: false,
    qnaCount: "2"
};

function readStudyRecords() {
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");

        if (!Array.isArray(stored)) return [];

        return stored.filter(function(record) {
            return record && typeof record.title === "string";
        }).map(function(record) {
            return {
                title: record.title,
                duration: ["3", "5", "10"].includes(record.duration)
                    ? record.duration : "5",
                qna: record.qna === true,
                qnaCount: ["1", "2", "3"].includes(record.qnaCount)
                    ? record.qnaCount : "2",
                completed: record.completed === true
            };
        });
    } catch {
        return [];
    }
}

const studyRecords = readStudyRecords();

function saveStudyRecords() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(studyRecords));
        return true;
    } catch {
        return false;
    }
}

function showStep(index) {
    flowSteps.forEach((step, i) => {
        step.hidden = i !== index;
    });

    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
    });

    const heading = flowSteps[index].querySelector("h3");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
}

const recordsList = document.querySelector("#records-list");
const recordsMessage = document.querySelector("#records-message");

function showStudyRecords() {
    recordsList.innerHTML = "";

    if (studyRecords.length === 0) {
        recordsMessage.textContent = "아직 등록된 학습 기록이 없습니다.";
        return;
    }

    recordsMessage.textContent = "나의 학습 기록을 확인해 보세요.";

    for (let i = 0; i < studyRecords.length; i++) {
        const record = studyRecords[i];
        const item = document.createElement("li");

        const recordTitle = document.createElement("h3");
        recordTitle.textContent = "기록 " + (i + 1);

        const title = document.createElement("p");
        title.textContent = "학습자: " + record.title;

        const duration = document.createElement("p");
        duration.textContent = "학습 시간: " + record.duration + "시간";

        const qna = document.createElement("p");

        if (record.qna) {
            qna.textContent = "질문 설정: " + record.qnaCount + "개 포함";
        } else {
            qna.textContent = "질문 설정: 미포함";
        }

        const status = document.createElement("p");

        if (record.completed) {
            status.textContent = "학습 상태: 완료";
        } else {
            status.textContent = "학습 상태: 진행 전";
        }

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = record.completed ? "완료 취소" : "학습 완료";

        button.addEventListener("click", function() {
            record.completed = !record.completed;
            saveStudyRecords();
            showStudyRecords();
        });

        item.appendChild(recordTitle);
        item.appendChild(title);
        item.appendChild(duration);
        item.appendChild(qna);
        item.appendChild(status);
        item.appendChild(button);

        recordsList.appendChild(item);
    }
}

const infoDialog = document.querySelector("#infoDialog");
const infoCancel = document.querySelector("#info-cancel");
const infoConfirm = document.querySelector("#info-confirm");

function revokeinfoAgreement() {
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
    trainingFlow.scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
});

function showTitleError(message) {
    titleInput.setAttribute("aria-invalid", "true");
    titleError.textContent = message;
    titleField.classList.remove("is-valid");
    titleField.classList.add("has-error");
    return false;
}

function clearTitleError() {
    titleInput.removeAttribute("aria-invalid");
    titleError.textContent = "";
    titleField.classList.remove("has-error");
    updateTitleExperience();
}

function validateTitle() {
    const title = titleInput.value.trim();

    if (!title) {
        return showTitleError("학습자 이름을 입력해 주세요.");
    }

    if (title.length < 2) {
        return showTitleError("학습자 이름을 2자 이상 입력해 주세요.");
    }

    clearTitleError();
    formData.title = title;
    return true;
}

function updateTitleExperience() {
    const length = titleInput.value.length;
    const enough = titleInput.value.trim().length >= 2;
    const invalid = titleInput.getAttribute("aria-invalid") === "true";

    titleCount.textContent = `${length} / 60자`;
    titleField.classList.toggle("is-valid", enough && !invalid);

    if (!invalid) {
        titleHelp.textContent = enough
            ? "입력 조건을 충족했습니다."
            : "학습자 이름을 2자 이상 입력해 주세요.";
    }
}

titleInput.addEventListener("input", () => {
    updateTitleExperience();

    if (titleInput.getAttribute("aria-invalid") === "true") {
        validateTitle();
    }
});

updateTitleExperience();

titleNext.addEventListener("click", () => {
    if (!validateTitle()) return;
    showStep(1);
});

durationRange.addEventListener("input", () => {
    durationValue.value = durationValues[durationRange.value] + "시간";
});

function syncQnaFields() {
  const open = qnaOption.checked;
  qnaOption.setAttribute("aria-expanded", String(open));
  qnaOptions.hidden = !open;
  qnaCountInputs.forEach((input) => {
    input.disabled = !open;
  });
}

qnaOption.addEventListener("change", syncQnaFields);
syncQnaFields();

optionPrev.addEventListener("click", () => {
    showStep(0);
});

optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked;

    const count = document.querySelector('input[name="qna-count"]:checked');

    if (count) {
        formData.qnaCount = count.value;
    }

    summaryTitle.textContent = formData.title;
    summaryDuration.textContent = formData.duration + "시간";
    summaryQna.textContent = formData.qna
        ? formData.qnaCount + "개 포함"
        : "미포함";

    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));

function setSubmitState(loading, message) {
    form.setAttribute("aria-busy", String(loading));
    saveButton.disabled = loading;
    saveButton.textContent = loading
        ? "저장하는 중…"
        : "설정 완료하기";
    submitStatus.textContent = message;
}

function wait(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function persistPlan(record) {
    await wait(600);

    if (forceSaveFailure) {
        throw new Error("수업용 저장 실패");
    }

    studyRecords.unshift(record);

    if (!saveStudyRecords()) {
        studyRecords.shift();
        throw new Error("브라우저 저장 실패");
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form.getAttribute("aria-busy") === "true") return;

    const currentStep = [...flowSteps].findIndex((step) => !step.hidden);

    if (currentStep === 0) {
        titleNext.click();
        return;
    }

    if (currentStep !== 2) return;

    if (!validateTitle()) {
        showStep(0);

        window.requestAnimationFrame(() => {
            form.querySelector('[aria-invalid="true"]')?.focus();
        });

        return;
    }

    const record = {
        title: formData.title,
        duration: formData.duration,
        qna: formData.qna,
        qnaCount: formData.qnaCount,
        completed: false
    };

    setSubmitState(true, "학습 설정을 저장하고 있습니다.");

    try {
        await persistPlan(record);

        showStudyRecords();

        setSubmitState(false, "학습 설정을 저장했습니다.");

        showStep(3);
    } catch {
        setSubmitState(
            false,
            "저장하지 못했습니다. 입력한 내용은 그대로 두었습니다. 다시 시도해 주세요."
        );
    }
});

restartButton.addEventListener("click", () => {
    form.reset();
    syncQnaFields();

    formData.title = "";
    formData.duration = "5";
    formData.qna = false;
    formData.qnaCount = "2";

    nicknameCount.textContent = "0 / 10";
    titleCount.textContent = "0 / 60자";
    titleHelp.textContent = "학습자 이름을 2자 이상 입력해 주세요.";
    titleError.textContent = "";

    titleInput.removeAttribute("aria-invalid");
    titleField.classList.remove("is-valid", "has-error");

    durationValue.value = "5시간";

    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent = "";

    setSubmitState(false, "");

    showStep(0);
    titleInput.focus();
});

showStudyRecords();