import { AtSign, Briefcase, Calendar, ExternalLink, Globe, Mail, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserProfile } from "@/lib/types"


interface UserData {
  fullname: string
  email: string
  created_at: string,
  updated_at: string
  profile: UserProfile
}

interface AccountDetailsProps {
  userData: UserData
}

export function AccountDetails({ userData }: AccountDetailsProps) {

  return (
    <div className="space-y-6 py-2">
      {/* Personal Information Section */}
      <section>
        <h3 className="text-lg font-medium flex items-center">
          <User className="mr-2 h-5 w-5 text-primary" />
          Personal Information
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Your personal details and contact information.
        </p>

        <div className="mt-4 grid gap-4">
          <InfoCard
            icon={<User className="h-5 w-5 text-muted-foreground" />}
            label="Full Name"
            value={userData.fullname}
          />

          <InfoCard
            icon={<Mail className="h-5 w-5 text-muted-foreground" />}
            label="Email Address"
            value={userData.email}
          />

          <InfoCard
            icon={<AtSign className="h-5 w-5 text-muted-foreground" />}
            label="Username"
            value={`@${userData.profile?.username || ''}`}
          />
        </div>
      </section>

      <Separator />

      {/* Profile Details Section */}
      <section>
        <h3 className="text-lg font-medium flex items-center">
          <Briefcase className="mr-2 h-5 w-5 text-primary" />
          Profile Details
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Information visible on your public profile.
        </p>

        <div className="mt-4 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Bio
            </div>
            {userData.profile.bio ? (
              <p className="text-sm leading-relaxed">{userData.profile.bio}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No bio provided</p>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Website
            </div>
            {userData.profile.website ? (
              <a
                href={userData.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm flex items-center text-primary hover:underline"
              >
                {userData.profile.website}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            ) : (
              <p className="text-sm text-muted-foreground italic">No website provided</p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Account Information Section */}
      <section className="bg-muted/30 rounded-lg p-4">
        <h3 className="text-sm font-medium flex items-center mb-3">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          Account Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Member Since</div>
            <div className="text-sm font-medium">{new Date(
              userData.created_at
            ).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
            )}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground">Last Updated</div>
            <div className="text-sm font-medium">{
              new Date(
                userData.updated_at
              ).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
              )
            }</div>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs text-muted-foreground mb-1">Account Status</div>
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              Active
            </Badge>
          </div>
        </div>
      </section>
    </div>
  )
}

interface InfoCardProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-[25px_1fr] gap-x-4 items-center">
      {icon}
      <div>
        <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  )
}
