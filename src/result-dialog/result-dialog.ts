export interface IIssue {
    line_number: string;
    severity: string;
    header: string;
    comment: string;
    coding_best_practice: string;
}

export interface IReviewData {
    status: string;
    duration?: number;
    percentage?: number;
    result?: IIssue[];
}
export class ResultDialog {
    dialog: any;
    data = {
        status: "COMPLETED",
        percentage: 100.0,
        duration: 145.32,
        result: [
            {
                file_path: "src/components/Button.tsx",
                header: "Naming Convention",
                comment:
                    "The naming convention for `PrimaryButton` is inconsistent with other components.",
                line_number: 42,
                coding_best_practice: "BP401",
                severity: "N",
            },
            {
                file_path: "src/utils/api.ts",
                header: "Error Handling",
                comment:
                    "Missing proper error handling for failed API requests. Consider adding a try/catch block.",
                line_number: 88,
                coding_best_practice: "BP203",
                severity: "S",
            },
            {
                file_path: "src/services/auth.ts",
                header: "Security",
                comment:
                    "Sensitive information (API token) is being logged. Remove logging for security reasons.",
                line_number: 160,
                coding_best_practice: "BP901",
                severity: "C",
            },
            {
                file_path: "src/components/Card.tsx",
                header: "Accessibility",
                comment: "Missing `alt` text on image elements.",
                line_number: 15,
                coding_best_practice: "BP105",
                severity: "S",
            },
            {
                file_path: "src/components/Card.tsx",
                header: "Code Style",
                comment: "Indentation does not follow project style guide.",
                line_number: 22,
                coding_best_practice: "BP002",
                severity: "N",
            },
            {
                file_path: "src/components/Card.tsx",
                header: "Performance",
                comment:
                    "Unnecessary re-renders detected. Consider memoization for child components.",
                line_number: 78,
                coding_best_practice: "BP601",
                severity: "C",
            },
            {
                file_path: "src/pages/Dashboard.tsx",
                header: "Best Practices",
                comment: "Inline styles found. Move styles to CSS/SCSS file.",
                line_number: 45,
                coding_best_practice: "BP320",
                severity: "N",
            },
            {
                file_path: "src/pages/Dashboard.tsx",
                header: "Error Handling",
                comment: "API response not validated before use.",
                line_number: 67,
                coding_best_practice: "BP207",
                severity: "S",
            },
            {
                file_path: "src/pages/Dashboard.tsx",
                header: "Performance",
                comment: "Large image loaded without lazy loading.",
                line_number: 120,
                coding_best_practice: "BP603",
                severity: "C",
            },
            {
                file_path: "src/pages/Dashboard.tsx",
                header: "Maintainability",
                comment: "Function exceeds 80 lines, consider refactoring.",
                line_number: 300,
                coding_best_practice: "BP701",
                severity: "S",
            },
            {
                file_path: "src/hooks/useAuth.ts",
                header: "Security",
                comment: "Token stored in localStorage, use cookies with HttpOnly flag.",
                line_number: 18,
                coding_best_practice: "BP902",
                severity: "C",
            },
            {
                file_path: "src/hooks/useAuth.ts",
                header: "Code Style",
                comment: "Function names should use camelCase.",
                line_number: 48,
                coding_best_practice: "BP004",
                severity: "N",
            },
            {
                file_path: "src/hooks/useAuth.ts",
                header: "Error Handling",
                comment: "Silent error caught without logging.",
                line_number: 62,
                coding_best_practice: "BP208",
                severity: "S",
            },
            {
                file_path: "src/services/userService.ts",
                header: "Performance",
                comment: "Nested loops may cause O(n^2) complexity.",
                line_number: 132,
                coding_best_practice: "BP605",
                severity: "C",
            },
            {
                file_path: "src/services/userService.ts",
                header: "Maintainability",
                comment: "Magic numbers found. Use constants instead.",
                line_number: 80,
                coding_best_practice: "BP705",
                severity: "N",
            },
            {
                file_path: "src/services/userService.ts",
                header: "Error Handling",
                comment: "Uncaught promise rejection risk.",
                line_number: 210,
                coding_best_practice: "BP209",
                severity: "S",
            },
            {
                file_path: "src/index.tsx",
                header: "Best Practices",
                comment: "Console logs should be removed in production.",
                line_number: 12,
                coding_best_practice: "BP311",
                severity: "N",
            },
            {
                file_path: "src/index.tsx",
                header: "Performance",
                comment: "Non-critical scripts loaded synchronously.",
                line_number: 35,
                coding_best_practice: "BP606",
                severity: "S",
            },
            {
                file_path: "src/index.tsx",
                header: "Security",
                comment:
                    "Potential XSS vulnerability due to dangerouslySetInnerHTML usage.",
                line_number: 90,
                coding_best_practice: "BP903",
                severity: "C",
            },
        ],
    } as IReviewData;

    constructor(data: IReviewData) {
        // this.data = data; // todo set data later
    }


    createResultDialog() {
        // Remove old dialog if exists
        document.querySelector("#ai-review-dialog")?.remove();

        this.dialog = document.createElement("dialog");
        this.dialog.id = "ai-review-dialog";
        this.dialog.classList.add("ai-review-dialog");

        // --- Header ---
        const title = document.createElement("h2");
        title.innerText = `AI Review Result (Status: ${this.data.status
            }, Duration: ${this.data.duration?.toFixed(2)}s)`;
        this.dialog.appendChild(title);

        const progress = document.createElement("p");
        progress.innerText = `Progress: ${this.data.percentage ?? 0}%`;
        this.dialog.appendChild(progress);

        if (this.data.result?.length) {
            // --- Build sidebar + content wrapper ---
            const wrapper = document.createElement("div");
            wrapper.classList.add("ai-review-wrapper");

            const sidebar = document.createElement("div");
            sidebar.classList.add("ai-review-sidebar");

            const content = document.createElement("div");
            content.classList.add("ai-review-content");

            // Group issues by file
            const issuesByFile: Record<string, any[]> = {};
            this.data.result.forEach((issue: any) => {
                if (!issuesByFile[issue.file_path]) {
                    issuesByFile[issue.file_path] = [];
                }
                issuesByFile[issue.file_path].push(issue);
            });

            const fileNames = Object.keys(issuesByFile);

            // --- Sidebar buttons ---
            fileNames.forEach((file, index) => {
                const btn = document.createElement("button");
                btn.innerText = file;
                btn.classList.add("ai-file-tab");
                if (index === 0) btn.classList.add("active");

                btn.onclick = () => {
                    // Highlight active tab
                    sidebar
                        .querySelectorAll("button")
                        .forEach((b) => b.classList.remove("active"));
                    btn.classList.add("active");

                    // Render issues for this file
                    this.renderFileIssues(file, issuesByFile[file], content);
                };

                sidebar.appendChild(btn);
            });

            // --- Initial load: first file ---
            if (fileNames.length > 0) {
                this.renderFileIssues(fileNames[0], issuesByFile[fileNames[0]], content);
            }

            wrapper.appendChild(sidebar);
            wrapper.appendChild(content);
            this.dialog.appendChild(wrapper);
        } else {
            const none = document.createElement("p");
            none.innerText = "✅ No issues found!";
            this.dialog.appendChild(none);
        }

        // --- Close button ---
        const closeBtn = document.createElement("button");
        closeBtn.innerText = "Close";
        closeBtn.classList.add("ai-review-close");
        this.dialog.appendChild(closeBtn);

        closeBtn.onclick = () => this.closeDialog();

        document.body.appendChild(this.dialog);
        this.dialog.showModal();
    }

    closeDialog() {
        document.body.removeChild(this.dialog);
    }

    // --- Helper to render issues for one file ---
    renderFileIssues(file: string, issues: IIssue[], container: HTMLElement) {
        container.innerHTML = `<h3>${file}</h3>`;
        const list = document.createElement("ul");
        list.classList.add("ai-review-list");

        issues.forEach((issue: IIssue) => {
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
}