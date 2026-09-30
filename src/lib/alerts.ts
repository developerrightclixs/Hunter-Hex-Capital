import Swal from "sweetalert2";

/** SweetAlert2 preset in the site palette (see the `hh-*` tokens in globals.css). */
const themed = Swal.mixin({
  background: "#06150f",
  color: "#f3efe7",
  confirmButtonColor: "#d9b872",
  iconColor: "#d9b872",
  customClass: {
    popup: "!rounded-[20px] !border !border-hh-gold-dark",
    confirmButton: "!rounded-[8px] !font-bold !text-hh-green",
  },
});

export function showSubmitSuccess(text: string) {
  return themed.fire({ icon: "success", title: "Thank you!", text });
}

export function showSubmitError(text: string) {
  return themed.fire({
    icon: "error",
    iconColor: "#d9534f",
    title: "Submission failed",
    text,
  });
}
