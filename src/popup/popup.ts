chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (
    tab.url !== undefined &&
    !tab.url.includes("https://bitbucket.svc.elca.ch")
  ) {
    window.close();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id! },
        func: () => {
          return {
            server: localStorage.getItem("ELCA_AGENT_API"),
            secret: localStorage.getItem("ELCA_AGENT_SECRET"),
          };
        },
      },
      (results) => {
        const data = results?.[0].result!;
        (<HTMLInputElement>document.getElementById("server")!).value =
          data?.server ?? "";
        (<HTMLInputElement>document.getElementById("secret")!).value =
          data?.secret ?? "";
      }
    );
  });

  document.querySelector("form")!.onsubmit = save;
});

async function save(e: SubmitEvent) {
  e.preventDefault();
  const formData = new FormData(<HTMLFormElement>e.target);
  const data = Object.fromEntries(formData);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: (d) => {
      localStorage.setItem("ELCA_AGENT_API", <string>d.server);
      localStorage.setItem("ELCA_AGENT_SECRET", <string>d.secret);
    },
    args: [data],
  });

  window.close();
}
