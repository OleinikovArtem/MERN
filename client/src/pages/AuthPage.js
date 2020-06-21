import React, { useState, useEffect } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'


export const AuthPage = () => {
  const message = useMessage()
  const { loading, request, error, clearError } = useHttp()
  const [form, setForm] = useState({
    email: '', password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = ({ target }) => {
    setForm({ ...form, [target.name]: target.value })
  }

  const registrHandle = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form },)
      message(data.message)
    } catch (e) { }
  }

  const loginHandle = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form },)
      message(data.message)
    } catch (e) { }
  }

  return (
    <div className='row'>
      <div className="col s6 offset-s3">
        <h1>Shorten link</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>

            <div>

              <div className="input-field ">
                <input
                  placeholder="Your Email"
                  id="email"
                  type="text"
                  name='email'
                  className='yellow-input'
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field ">
                <input
                  placeholder="Your password"
                  id="passwortd"
                  type="password"
                  name='password'
                  className='yellow-input'
                  onChange={changeHandler}

                />
                <label htmlFor="email">Password</label>
              </div>

            </div>
          </div>

          <div className="card-action">

            <button
              onClick={loginHandle}
              disabled={loading}
              className='btn yellow darken-4'
            >
              Login
            </button>

            <button
              onClick={registrHandle}
              disabled={loading}
              className='btn grey lighten-1 black-text'
            >
              Registation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
