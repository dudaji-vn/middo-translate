import { User } from "@/features/users/types";

type IDoodleImage = Record<
string,
{
  user: User;
  image: string;
  color: string;
}
>;

export default IDoodleImage;
