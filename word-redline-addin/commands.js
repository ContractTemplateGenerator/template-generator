/**
 * Commands for the Redline Processor Add-in
 */

Office.onReady(() => {
    // Commands are loaded and ready
});

/**
 * Shows the task pane
 * @param event
 */
function showTaskpane(event) {
    // This function is called when the user clicks the ribbon button
    // The task pane will be shown automatically by the platform
    event.completed();
}