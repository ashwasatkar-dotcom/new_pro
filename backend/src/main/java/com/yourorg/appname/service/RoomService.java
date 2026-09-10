package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.RoomRequest;
import com.yourorg.appname.dto.response.RoomResponse;
import java.util.List;

public interface RoomService {
    List<RoomResponse> getAllRooms(String wing, Integer floor, String status);
    RoomResponse getRoomById(Long id);
    RoomResponse createRoom(RoomRequest request);
    RoomResponse updateRoom(Long id, RoomRequest request);
    RoomResponse assignStudentToRoom(Long roomId, Long studentId, String bedNumber);
    RoomResponse removeStudentFromRoom(Long roomId, Long studentId);
    void deleteRoom(Long id);
}
