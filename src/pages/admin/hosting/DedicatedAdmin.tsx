import { HostingPlansAdmin } from "../HostingPlansAdmin";
export default function DedicatedAdmin() {
  return <HostingPlansAdmin category={{ key: "dedicated", label: "Dedicated Servers" }} />;
}
