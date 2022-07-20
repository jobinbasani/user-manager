import {
  UserData, UserDataCanadianStatusEnum, UserDataGenderEnum, UserDataMaritalStatusEnum, UserDataRelationEnum,
} from '../../generated-sources/openapi';
import TitleAndSubtitle from '../text/TitleAndSubtitle';

type UserDetailsProps = {
  member:UserData
}

export default function UserDetails({ member }:UserDetailsProps) {
  let address = [member.street, member.city, member.province, member.postalCode];
  if (member.apartment && member.apartment.length > 0) {
    address = [member.apartment, ...address];
  }
  return (
    <>
      <TitleAndSubtitle title="Gender" subtitle={member.gender} source={UserDataGenderEnum} />
      <TitleAndSubtitle title="Birthday" subtitle={member.dateOfBirth} formatDate />
      <TitleAndSubtitle title="Email" subtitle={member.email} />
      <TitleAndSubtitle title="Marital Status" subtitle={member.maritalStatus} source={UserDataMaritalStatusEnum} />
      <TitleAndSubtitle title="Date of Marriage" subtitle={member.dateOfMarriage} formatDate />
      <TitleAndSubtitle title="Baptismal Name" subtitle={member.baptismalName} />
      <TitleAndSubtitle title="Relation" subtitle={member.relation} source={UserDataRelationEnum} />
      <TitleAndSubtitle title="House Name" subtitle={member.houseName} />
      <TitleAndSubtitle title="Family Unit" subtitle={member.familyUnit} />
      <TitleAndSubtitle title="Date of Baptism" subtitle={member.dateOfBaptism} formatDate />
      <TitleAndSubtitle title="Date of Confirmation" subtitle={member.dateOfConfirmation} formatDate />
      <TitleAndSubtitle title="Status in Canada" subtitle={member.canadianStatus} source={UserDataCanadianStatusEnum} />
      <TitleAndSubtitle title="In Canada Since" subtitle={member.inCanadaSince} formatDate />
      <TitleAndSubtitle title="Home Parish" subtitle={member.homeParish} />
      <TitleAndSubtitle title="Diocese in India" subtitle={member.dioceseInIndia} />
      <TitleAndSubtitle title="Previous Parish in Canada" subtitle={member.previousParishInCanada} />
      <TitleAndSubtitle title="Address" subtitle={address.join(', ')} />
      <TitleAndSubtitle title="Mobile Number" subtitle={member.mobile} />
    </>
  );
}
