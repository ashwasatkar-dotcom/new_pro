package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.RoomRequest;
import com.yourorg.appname.dto.response.RoomResponse;
import com.yourorg.appname.entity.Room;
import com.yourorg.appname.entity.Student;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.RoomRepository;
import com.yourorg.appname.repository.StudentRepository;
import com.yourorg.appname.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final StudentRepository studentRepository;
    private final EntityMapper mapper;

    @Override
    public List<RoomResponse> getAllRooms(String wing, Integer floor, String status) {
        List<Room> rooms = roomRepository.findAll();

        if (wing != null && !wing.trim().isEmpty() && !wing.equalsIgnoreCase("ALL")) {
            rooms = rooms.stream().filter(r -> r.getWing().equalsIgnoreCase(wing.trim())).collect(Collectors.toList());
        }
        if (floor != null && floor > 0) {
            rooms = rooms.stream().filter(r -> r.getFloor().equals(floor)).collect(Collectors.toList());
        }
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            rooms = rooms.stream().filter(r -> r.getStatus().equalsIgnoreCase(status.trim())).collect(Collectors.toList());
        }

        return rooms.stream().map(r -> {
            List<Student> occupants = studentRepository.findByRoomId(r.getId());
            return mapper.toRoomResponse(r, occupants);
        }).collect(Collectors.toList());
    }

    @Override
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
        List<Student> occupants = studentRepository.findByRoomId(room.getId());
        return mapper.toRoomResponse(room, occupants);
    }

    @Override
    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.findByRoomNumberAndWing(request.getRoomNumber(), request.getWing()).isPresent()) {
            throw new BadRequestException("Room " + request.getRoomNumber() + " in " + request.getWing() + " already exists");
        }

        Room room = Room.builder()
                .roomNumber(request.getRoomNumber())
                .wing(request.getWing())
                .floor(request.getFloor())
                .roomType(request.getRoomType())
                .capacity(request.getCapacity() != null ? request.getCapacity() : 3)
                .occupiedBeds(0)
                .monthlyRent(request.getMonthlyRent() != null ? request.getMonthlyRent() : new BigDecimal("1200.00"))
                .status("AVAILABLE")
                .build();

        Room saved = roomRepository.save(room);
        return mapper.toRoomResponse(saved, List.of());
    }

    @Override
    @Transactional
    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));

        room.setRoomNumber(request.getRoomNumber());
        room.setWing(request.getWing());
        room.setFloor(request.getFloor());
        room.setRoomType(request.getRoomType());
        if (request.getCapacity() != null) room.setCapacity(request.getCapacity());
        if (request.getMonthlyRent() != null) room.setMonthlyRent(request.getMonthlyRent());
        if (request.getStatus() != null) room.setStatus(request.getStatus());

        Room updated = roomRepository.save(room);
        List<Student> occupants = studentRepository.findByRoomId(updated.getId());
        return mapper.toRoomResponse(updated, occupants);
    }

    @Override
    @Transactional
    public RoomResponse assignStudentToRoom(Long roomId, Long studentId, String bedNumber) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        if (room.getOccupiedBeds() >= room.getCapacity()) {
            throw new BadRequestException("Room " + room.getRoomNumber() + " is already at full capacity");
        }

        // If student was in another room, decrement old room's count
        if (student.getRoom() != null && !student.getRoom().getId().equals(roomId)) {
            Room oldRoom = student.getRoom();
            if (oldRoom.getOccupiedBeds() > 0) {
                oldRoom.setOccupiedBeds(oldRoom.getOccupiedBeds() - 1);
                oldRoom.setStatus(oldRoom.getOccupiedBeds() == 0 ? "AVAILABLE" : "PARTIALLY_OCCUPIED");
                roomRepository.save(oldRoom);
            }
        }

        student.setRoom(room);
        student.setBedNumber(bedNumber != null ? bedNumber : "Bed " + (char)('A' + room.getOccupiedBeds()));
        studentRepository.save(student);

        room.setOccupiedBeds(room.getOccupiedBeds() + 1);
        if (room.getOccupiedBeds() >= room.getCapacity()) {
            room.setStatus("FULL");
        } else {
            room.setStatus("PARTIALLY_OCCUPIED");
        }
        Room updated = roomRepository.save(room);

        List<Student> occupants = studentRepository.findByRoomId(updated.getId());
        return mapper.toRoomResponse(updated, occupants);
    }

    @Override
    @Transactional
    public RoomResponse removeStudentFromRoom(Long roomId, Long studentId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        student.setRoom(null);
        student.setBedNumber(null);
        studentRepository.save(student);

        if (room.getOccupiedBeds() > 0) {
            room.setOccupiedBeds(room.getOccupiedBeds() - 1);
        }
        if (room.getOccupiedBeds() == 0) {
            room.setStatus("AVAILABLE");
        } else {
            room.setStatus("PARTIALLY_OCCUPIED");
        }
        Room updated = roomRepository.save(room);

        List<Student> occupants = studentRepository.findByRoomId(updated.getId());
        return mapper.toRoomResponse(updated, occupants);
    }

    @Override
    @Transactional
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", id));
        List<Student> occupants = studentRepository.findByRoomId(room.getId());
        for (Student s : occupants) {
            s.setRoom(null);
            s.setBedNumber(null);
            studentRepository.save(s);
        }
        roomRepository.delete(room);
    }
}
