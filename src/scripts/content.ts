import { IReviewData, ResultDialog } from "../result-dialog/result-dialog";


////////// --- Setup button Start AI Review ---///////////////

const container = document.querySelector(".pull-request-title-review-section")!;

const statusWraper = document.createElement("div");
statusWraper.classList.add(
  "review-mode-button",
  "pull-request-header-review-button"
);
const presentation = document.createElement("div");
presentation.setAttribute("role", "presentation");
const button = document.createElement("button");
button.innerText = "Start AI Review";
button.classList.add("status-button", "review");

button.onclick = onClick;

presentation.appendChild(button);
statusWraper.appendChild(presentation);
container.appendChild(statusWraper);

const url = new URL(window.location.href);
const parts = url.pathname.split("/");
const project = parts[2];
const repo = parts[4];
const pullRequestId = parts[6];
const user = document
  .querySelector("#current-user")!
  .getAttribute("data-username");
fetch(
  `${localStorage.getItem(
    "ELCA_AGENT_API"
  )}/pr/result?project=${project}&repo=${repo}&pr_number=${pullRequestId}`
).then(async (x) => {
  const result = await x.json();
  if (result === "processing") {
    button.innerText = "AI Review In-Process";
    return;
  }

  const issues = result.review?.key_issues_to_review || [];

  issues.forEach((issue: any) => {
    const file = issue.relevant_file;
    const key = getKey(project, repo, pullRequestId, user, file);
    const existingItem = localStorage.getItem(key);
    const value = existingItem
      ? JSON.parse(existingItem)
      : { timestamp: new Date().getTime(), data: {} };
    const data = value.data;
    data[`ADDED-${issue.start_line}-TO`] = issue.issue_content;
    localStorage.setItem(key, JSON.stringify(value));
  });
});

function onClick() {
  fetch(
    `${localStorage.getItem(
      "ELCA_AGENT_API"
    )}/pr/review?project=${project}&repo=${repo}&pr_number=${pullRequestId}&token=${localStorage.getItem(
      "ELCA_AGENT_SECRET"
    )}`
  );
  button.innerText = "AI Review In-Process";
}

function getKey(project: any, repo: any, prId: any, user: any, file: any) {
  return `draft-pull-request-${project}/${repo}/${prId}-user-${user}-diff-${file}/EFFECTIVE`;
}

////////// --- Setup button View AI Commment ---///////////////

const openCommentDialog = document.createElement("button");
openCommentDialog.innerText = "View AI Comment";
openCommentDialog.classList.add("status-button", "review");

openCommentDialog.onclick = async () => {
  const test = {} as IReviewData;
  const dialog = new ResultDialog(test);
  dialog.createResultDialog();
};

presentation.appendChild(openCommentDialog);
statusWraper.appendChild(presentation);
container.appendChild(statusWraper);
