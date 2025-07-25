import MethodDetails from "../../../components/MethodDetails"

export default function MethodPage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch the method data based on params.id
  return <MethodDetails />
}
