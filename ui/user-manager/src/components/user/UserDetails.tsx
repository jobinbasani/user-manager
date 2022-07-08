import { format } from 'date-fns';
import { UserData, UserDataGenderEnum, UserDataMaritalStatusEnum } from '../../generated-sources/openapi';
import TitleAndSubtitle from '../text/TitleAndSubtitle';

type UserDetailsProps = {
  member:UserData
}

export default function UserDetails({ member }:UserDetailsProps) {
  const maritalStatus = member.maritalStatus ? Object.keys(UserDataMaritalStatusEnum)[Object.values(UserDataMaritalStatusEnum).indexOf(member.maritalStatus)] : null;
  return (
    <>
      <TitleAndSubtitle title="Gender" subtitle={Object.keys(UserDataGenderEnum)[Object.values(UserDataGenderEnum).indexOf(member.gender)]} />
      <TitleAndSubtitle title="Birthday" subtitle={format(new Date(member.dateOfBirth), 'MMM d, yyyy')} />
      <TitleAndSubtitle title="Email" subtitle={member.email} />
      {maritalStatus ? <TitleAndSubtitle title="Marital Status" subtitle={maritalStatus} /> : null}
      {member.baptismalName ? <TitleAndSubtitle title="Baptismal Name" subtitle={member.baptismalName} /> : null}
    </>
  );
}
