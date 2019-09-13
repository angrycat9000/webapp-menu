export default function materialIcon(name) {
    const icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerHTML = name;
    return icon;
}