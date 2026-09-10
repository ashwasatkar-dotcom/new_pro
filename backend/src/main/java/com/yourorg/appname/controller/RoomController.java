package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.RoomRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.RoomResponse;
import com.yourorg.appname.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAllRooms(
            @RequestParam(required = false) String wing,
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) String status) {
        List<RoomResponse> rooms = roomService.getAllRooms(wing, floor, status);
        return ResponseEntity.ok(ApiResponse.success(rooms));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(@PathVariable Long id) {
        RoomResponse room = roomService.getRoomById(id);
        return ResponseEntity.ok(ApiResponse.success(room));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(@Valid @RequestBody RoomRequest request) {
        RoomResponse created = roomService.createRoom(request);
        return ResponseEntity.ok(ApiResponse.success("Room created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request) {
        RoomResponse updated = roomService.updateRoom(id, request);
        return ResponseEntity.ok(ApiResponse.success("Room updated successfully", updated));
    }

    @PostMapping("/{roomId}/assign/{studentId}")
    public ResponseEntity<ApiResponse<RoomResponse>> assignStudent(
            @PathVariable Long roomId,
            @PathVariable Long studentId,
            @RequestParam(required = false) String bedNumber) {
        RoomResponse response = roomService.assignStudentToRoom(roomId, studentId, bedNumber);
        return ResponseEntity.ok(ApiResponse.success("Student assigned to room successfully", response));
    }

    @DeleteMapping("/{roomId}/remove/{studentId}")
    public ResponseEntity<ApiResponse<RoomResponse>> removeStudent(
            @PathVariable Long roomId,
            @PathVariable Long studentId) {
        RoomResponse response = roomService.removeStudentFromRoom(roomId, studentId);
        return ResponseEntity.ok(ApiResponse.success("Student unassigned from room successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok(ApiResponse.success("Room deleted successfully", null));
    }
}
