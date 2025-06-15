export function linkify() {
document.querySelectorAll("p").forEach(p => {
    p.innerHTML = p.innerHTML.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank">$1</a>'
    );
    });
}