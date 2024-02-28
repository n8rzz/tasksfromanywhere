const CREATE_TASK_CONTEXT_MENU_ID = "TFA_CREATE_TASK_CONTEXT_MENU_ITEM";

function _onClickContextMenuItem(info, tab) {
  if (info.menuItemId !== CREATE_TASK_CONTEXT_MENU_ID) {
    return;
  }

  const selectedText = info.selectionText;
  const pageUrl = info.pageUrl;

  const task = {
    title: selectedText,
    pageUrl: pageUrl,
  };

  console.log("+++ _onClickContextMenuItem", task);
  // chrome.action.openPopup();
  chrome.tabs.create(
    {
      url: chrome.runtime.getURL("options.html"),
      active: true,
    },
    // TODO: abstract - Callback after creating tab to make sure it loaded before sending message
    function (newTab) {
      chrome.tabs.onUpdated.addListener(function (tabId) {
        if (tabId !== newTab.id) {
          return;
        }

        chrome.runtime.sendMessage({
          action: "new_task",
          title: tab.title,
          selection: info.selectionText,
        });
      });
      chrome.tabs.update(newTab.id, { active: true });
    }
  );

  return;
}

chrome.contextMenus.create({
  id: CREATE_TASK_CONTEXT_MENU_ID,
  title: "Create Task from Anywhere",
  contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener(_onClickContextMenuItem);
