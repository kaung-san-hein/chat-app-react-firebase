import React, { useState, useEffect } from "react";
import Avatar from "../avatar.jpg";
import Camera from "../components/svg/Camera";
import Delete from "../components/svg/Delete";
import { storage, db, auth } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router";

const Profile = () => {
  const [img, setImg] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });

    if (img) {
      const uploadImage = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );

        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }

          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg(null);
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImage();
    }
  }, [img, user?.avatarPath]);

  const deleteImage = async () => {
      try{
        const confirm = window.confirm('Delete avatar?');
        if(confirm){
            await deleteObject(ref(storage, user.avatarPath));

            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                avatar: "",
                avatarPath: "",
            });
            navigate('/', { replace: true });
        }
      }catch(err){
          console.log(err.message);
      }
  }

  return user ? (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar || Avatar} alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              { user.avatar && <Delete deleteImage={deleteImage} /> }
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>Joined on: {user.createdAt.toDate().toDateString()}</small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
