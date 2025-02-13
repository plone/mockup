export default function MockSelectedItem({ target, props }) {
    console.log("MockSelectedItem initialized with", props);
    target.innerHTML = `<div style="border: 2px solid blue; padding: 10px;">
      Mocked Selected Item
  </div>`;
}
