import CardStatusCar from "@/components/CardStatusCar";

export default async function Parking({
  searchParams,
}: {
  searchParams: Promise<{ parking_name: string }>;
}) {
  const { parking_name } = await searchParams;

  return (
    <div className="w-full min-h-dvh flex items-center justify-center">
      <CardStatusCar parking_name={parking_name} />
    </div>
  );
}
