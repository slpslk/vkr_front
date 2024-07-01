import {useSelector} from 'react-redux';

export function useAuth() {
    const {fullName, username, token } = useSelector(state => state.user);

    return {
        isAuth: !!username,
        fullName,
        username,
        token,
    };
}