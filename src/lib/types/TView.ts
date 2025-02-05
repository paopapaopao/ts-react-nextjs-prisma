import { type View } from '@prisma/client';

type TView = {
  data: { view: View | null } | null;
  errors: { [key: string]: string[] } | null;
};

export default TView;
