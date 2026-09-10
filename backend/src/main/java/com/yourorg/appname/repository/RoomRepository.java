package com.yourorg.appname.repository;

import com.yourorg.appname.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumberAndWing(String roomNumber, String wing);
    List<Room> findByWing(String wing);
    List<Room> findByFloor(Integer floor);
    List<Room> findByStatus(String status);
    List<Room> findByWingAndFloor(String wing, Integer floor);
}
