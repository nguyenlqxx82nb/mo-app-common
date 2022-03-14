import jwt_decode from 'jwt-decode';
import Constants from './Constants';
import { IUserInfo } from '../Model/model';

const decodeToken = (token: string = undefined) : IUserInfo => {
    const userInfo = jwt_decode(token || Constants.AuthToken);
    const result : IUserInfo = userInfo && 
        {
            id: userInfo['id'],
            role_group: userInfo['role_group'],
            xPointJoinState: userInfo['xpoint_status'],
            supplierCode: userInfo['merchant_code'],
            avatar: userInfo['avatar'],
            merchantAvatar: userInfo['merchant_avatar'],
            accessName: userInfo['username'],
            merchantName: userInfo['merchant_name'],
            merchantID: userInfo['merchant_id'],
            typeSupplier: userInfo['merchant_type'],
            statusUseCallCenter: userInfo['use_callcenter'],
            staff_avatar: userInfo['avatar'],
            isAdmin: userInfo['is_admin'],
            isMobio: userInfo['is_mobio'],
            fullName: userInfo['fullname'],
            phoneNumber: userInfo['phone_number'],
            email: userInfo['email'],
            status: userInfo['status'],
            callCenter: userInfo['callcenter'],
            function: userInfo['functions'],
            is_sub_brand: userInfo['is_sub_brand']
        };
    return result;
}

export default { decodeToken }