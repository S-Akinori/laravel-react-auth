import React from "react";
import { Link } from "react-router-dom";

const Top = () => {
  return (
    <div className="p-4">
      <ul>
        <li><Link to="/register">登録</Link></li>
        <li><Link to="/login">ログイン</Link></li>
        <li><Link to="/home">ホーム</Link></li>
      </ul>
    </div>
  )
}

export default Top;