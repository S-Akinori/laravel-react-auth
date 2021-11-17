import axios, { AxiosResponse } from "axios";
import React, {useContext, createContext, useState, ReactNode, useEffect} from "react"
import {Route, Redirect, useHistory} from "react-router-dom"

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  two_factor_recovery_codes: string | null
  two_factor_secret: string | null
  created_at: string
  updated_at: string | null
}
interface LoginData {
  email: string,
  password: string,
}
interface RegisterData {
  email: string,
  password: string,
  password_confirmation: string,
}
interface ProfileData {
  name?: string,
  email?: string
}
interface authProps {
  user: User | null;
  register: (registerData: RegisterData) => Promise<void>
  signin: (loginData: LoginData) => Promise<void>;
  signout: () => Promise<void>;
  saveProfile: (formData: FormData | ProfileData) => Promise<void>;
}
interface Props {
  children: ReactNode
}
interface RouteProps {
  children: ReactNode,
  path: string,
  exact?: boolean
}
interface From {
  from: Location
}

const authContext = createContext<authProps | null>(null)

const ProvideAuth = ({children}: Props) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  )
}
export default ProvideAuth

export const useAuth = () => {
  return useContext(authContext)
}

const useProvideAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const register = (registerData: RegisterData) => {
    return axios.post('/api/register', registerData).then((res) => {
      axios.get('api/user').then((res) => {
        setUser(res.data)
      })
    })
  }

  const signin = async (loginData: LoginData) => {
    try {
      const res = await axios.post('/api/login', loginData);
    } catch (error) {
      throw error;
    }

    return axios.get('/api/user').then((res) => {
      setUser(res.data)
    }).catch((error) => {
      setUser(null)
    })
  }

  const signout = () => {
    return axios.post('/api/logout', {}).then(() => {
      setUser(null)
    })
  }

  const saveProfile = async (formData: FormData | ProfileData) => {
    const res = await axios.post(
      '/api/user/profile-information', 
      formData, 
      {headers: {'X-HTTP-Method-Override': 'PUT'}}
    )
    .catch((error) => {
      throw error;
    })
    if(res?.status == 200) {
      return axios.get('/api/user').then((res) => {
        setUser(res.data)
      }).catch((error) => {
        setUser(null)
      })
    }
  }

  useEffect(() => {
    axios.get('/api/user').then((res) => {
      setUser(res.data)
    }).catch((error) => {
      setUser(null)
    })
  }, [])

  return {
    user,
    register,
    signin,
    signout,
    saveProfile
  }
}

/**
 * 認証済みのみアクセス可能
 */
export const PrivateRoute = ({children, path, exact = false}: RouteProps) => {
  const auth = useAuth()
  return (
    <Route
      path={path}
      exact={exact}
      render={({ location }) => {
        if(auth?.user == null) {
          return <Redirect to={{ pathname: "/login", state: { from: location }}}/>
        } else {
          return children
        }
      }}
    />
  )
}


/**
 * 認証していない場合のみアクセス可能（ログイン画面など）
 */
export const PublicRoute = ({children, path, exact = false}: RouteProps) => {
  const auth = useAuth()
  const history = useHistory()
  return (
    <Route
      path={path}
      exact={exact}
      render={({ location }) => {
        if(auth?.user == null) {
          return children
        } else {
          return <Redirect to={{pathname: (history.location.state as From) ? (history.location.state as From).from.pathname : '/' , state: { from: location }}}/>
        }
      }}
    />
  )
}