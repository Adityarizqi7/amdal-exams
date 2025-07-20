export default function formatAngka(number) {
    return new Intl.NumberFormat('id-ID').format(number);
}  