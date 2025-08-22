import { ResultDialog } from "../result-dialog/result-dialog";

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

////////////////////////////////////////


const openCommentDialog = document.createElement("button");
openCommentDialog.innerText = "View AI Comment";
openCommentDialog.classList.add("status-button", "review");

openCommentDialog.onclick = async () => {
  // const resp = await fetch(
  //   `${localStorage.getItem(
  //     "ELCA_AGENT_API"
  //   )}/pr/result?project=${project}&repo=${repo}&pr_number=${pullRequestId}`
  // );
  // const data = await resp.json();
  var dialog = new ResultDialog();
  dialog.createResultDialog();
};

presentation.appendChild(openCommentDialog);
statusWraper.appendChild(presentation);
container.appendChild(statusWraper);


// --- Helper to render issues for one file ---
function renderFileIssues(file: string, issues: any[], container: HTMLElement) {
  container.innerHTML = `<h3>${file}</h3>`;
  const list = document.createElement("ul");
  list.classList.add("ai-review-list");

  issues.forEach((issue: any) => {
    const li = document.createElement("li");
    li.classList.add("ai-review-item", `severity-${issue.severity}`);

    li.innerHTML = `
      <strong>Line:</strong> ${issue.line_number}<br/>
      <strong>Header:</strong> ${issue.header}<br/>
      <strong>Comment:</strong> ${issue.comment}<br/>
      <strong>Best Practice:</strong> ${issue.coding_best_practice}<br/>
      <strong>Severity:</strong> <span class="severity-label">${issue.severity}</span>
    `;

    list.appendChild(li);
  });

  container.appendChild(list);
}
