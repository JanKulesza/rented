import JoinAgency from "@/components/join-agency/join-agency";
import { Agency } from "@/components/providers/agency-provider";
import { isPast, toDate } from "date-fns";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { redirect } from "next/navigation";

const JoinAgencyPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) => {
  const { token } = await searchParams;

  const decoded = jwtDecode<JwtPayload & { agencyId: string }>(token);

  const { exp, agencyId } = decoded;

  if (!exp || !agencyId || typeof agencyId !== "string")
    return redirect(`/?error=Invalid+invitation+token.`);

  if (isPast(toDate(exp * 1000)))
    return redirect(`/?error=Invitation+expired.`);

  const res = await fetch(`http://localhost:8080/api/agencies/${agencyId}`);

  if (!res.ok) {
    const error = await res.json();
    return redirect(`/?error=${error}`);
  }
  const agency = (await res.json()) as Agency;

  return (
    <div className="flex justify-center items-center h-[90vh] w-full overflow-auto">
      <JoinAgency
        agency={agency}
        redirectUrl={`http://localhost:3000/join-agency?token=${token}`}
        token={token}
      />
    </div>
  );
};

export default JoinAgencyPage;
