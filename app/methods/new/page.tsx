import MethodEditor from "../../../components/MethodEditor"

export default function NewMethodPage() {
  return (
    <MethodEditor
      isEditing={false}
      onSave={(method) => {
        console.log("Saving new method:", method)
        // Implement save logic
      }}
      onPublish={(method) => {
        console.log("Publishing new method:", method)
        // Implement publish logic and redirect
        window.location.href = `/methods/${method.id}`
      }}
    />
  )
}
