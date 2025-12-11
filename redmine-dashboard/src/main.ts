const API_BASE = "/redmine";
const REDMINE_WEB_BASE = "http://localhost:5555";

async function fetchIssues(apiKey: string) {
  // 担当者が自分 & オープン系チケット
  const url = `${API_BASE}/issues.json?assigned_to_id=me&status_id=open`;

  const res = await fetch(url, {
    headers: { "X-Redmine-API-Key": apiKey },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  return res.json();
}

function renderTable(issues: any[]) {
  const body = document.querySelector<HTMLTableSectionElement>("#issues-body")!;
  body.innerHTML = ""; // 初期化

  for (const issue of issues) {
    const tr = document.createElement("tr");
    const issueUrl = `${REDMINE_WEB_BASE}/issues/${issue.id}`;

    tr.innerHTML = `
      <td>
        <a href="${issueUrl}" target="_blank" rel="noopener noreferrer">
          #${issue.id}
        </a>
      </td>
      <td>${issue.subject}</td>
      <td>${issue.status?.name ?? "-"}</td>
      <td>${issue.assigned_to?.name ?? "-"}</td>
      <td>${issue.updated_on?.slice(0, 10) ?? "-"}</td>
    `;

    body.appendChild(tr);
  }
}


function setup() {
  const apiKeyInput = document.querySelector<HTMLInputElement>("#api-key")!;
  const loadButton = document.querySelector<HTMLButtonElement>("#load")!;
  const tableBody = document.querySelector("#issues-body")!;

  loadButton.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
      alert("APIキーを入力してください");
      return;
    }

    tableBody.innerHTML = `<tr><td colspan="5">取得中...</td></tr>`;

    try {
      const data = await fetchIssues(apiKey);
      renderTable(data.issues);
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="5">エラー: ${(err as Error).message}</td></tr>`;
    }
  });
}

setup();
