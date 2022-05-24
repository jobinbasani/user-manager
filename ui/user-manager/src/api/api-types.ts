
export interface User {
    userEmail: string;
    firstName: string;
    lastName: string;
}

/** Factory method to generate empty object since
 * reduxtoolkit doesn't lile classes as action params
 */

export const getEmptyUser = () => ({
    firstName: '',
    lastName: '',
    userEmail: ''
})
