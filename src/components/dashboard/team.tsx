'use client'

import { User } from "@/src/types/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import { fetchUsers } from "@/src/apis/funcs/users";

const Team = () => {
  const { data } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <motion.div>
      {data?.map((user) => (
        <div key={user.id}>
          <Image
            src= {`${user.avatar}`}
            width={50}
            height={50}
            alt="Picture of the author"
          />
        </div>
      ))}
    </motion.div>
  );
};

export default Team;
