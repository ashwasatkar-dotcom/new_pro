import React, { useState, useEffect } from 'react';
import { roomService } from '../../services/roomService';
import { studentService } from '../../services/studentService';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWing, setSelectedWing] = useState('ALL');
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Assign Bed Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetRoom, setTargetRoom] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [targetBedNumber, setTargetBedNumber] = useState('Bed A');

  // Create Room Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    roomNumber: '',
    wing: 'Wing B',
    floor: 2,
    roomType: 'Triple AC',
    capacity: 3,
    monthlyRent: 1450,
  });

  useEffect(() => {
    loadRooms();
    loadUnassignedStudents();
  }, [selectedWing, selectedFloor, selectedStatus]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const res = await roomService.getAllRooms({
        wing: selectedWing !== 'ALL' ? selectedWing : null,
        floor: selectedFloor > 0 ? selectedFloor : null,
        status: selectedStatus !== 'ALL' ? selectedStatus : null,
      });
      if (res.success) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error('Failed to load rooms', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnassignedStudents = async () => {
    try {
      const res = await studentService.getAllStudents();
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Failed to load students for allocation', err);
    }
  };

  const handleOpenAssign = (room) => {
    setTargetRoom(room);
    setTargetBedNumber(`Bed ${String.fromCharCode(65 + room.occupiedBeds)}`);
    setSelectedStudentId('');
    setAssignModalOpen(true);
  };

  const handleAssignBed = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !targetRoom) return;

    try {
      await roomService.assignStudent(targetRoom.id, selectedStudentId, targetBedNumber);
      setAssignModalOpen(false);
      loadRooms();
      loadUnassignedStudents();
    } catch (err) {
      console.error('Failed to assign bed', err);
      alert(err.response?.data?.message || 'Failed to assign bed');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await roomService.createRoom(newRoomData);
      setCreateModalOpen(false);
      setNewRoomData({
        roomNumber: '',
        wing: 'Wing B',
        floor: 2,
        roomType: 'Triple AC',
        capacity: 3,
        monthlyRent: 1450,
      });
      loadRooms();
    } catch (err) {
      console.error('Failed to create room', err);
      alert(err.response?.data?.message || 'Failed to create room');
    }
  };

  const handleRemoveStudent = async (roomId, studentId) => {
    if (window.confirm('Unassign this resident from the room?')) {
      try {
        await roomService.removeStudent(roomId, studentId);
        loadRooms();
        loadUnassignedStudents();
      } catch (err) {
        console.error('Failed to remove student from room', err);
      }
    }
  };

  return (
    <div className="flex flex-col w-full px-gutter-mobile py-4 gap-space-md">
      {/* Sector & Floor Filter Bar */}
      <section className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">apartment</span>
          </div>
          <div>
            <span className="font-label-sm text-[11px] text-secondary uppercase tracking-wider block">
              Active Sector
            </span>
            <span className="font-title-md text-title-md text-on-surface font-bold">
              {selectedFloor === 0 ? 'All Floors' : `Floor ${selectedFloor}`} • {selectedWing}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(Number(e.target.value))}
            className="px-3 py-2 bg-surface-container rounded-lg font-label-md text-sm text-on-surface outline-none border border-slate-200 cursor-pointer"
          >
            <option value={0}>All Floors</option>
            <option value={1}>Floor 1</option>
            <option value={2}>Floor 2</option>
            <option value={3}>Floor 3</option>
            <option value={4}>Floor 4</option>
          </select>

          <select
            value={selectedWing}
            onChange={(e) => setSelectedWing(e.target.value)}
            className="px-3 py-2 bg-surface-container rounded-lg font-label-md text-sm text-on-surface outline-none border border-slate-200 cursor-pointer"
          >
            <option value="ALL">All Wings</option>
            <option value="Wing A">Wing A</option>
            <option value="Wing B">Wing B</option>
            <option value="Wing C">Wing C</option>
          </select>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-3 py-2 bg-primary text-on-primary rounded-lg font-label-md text-sm font-semibold flex items-center gap-1 hover:bg-primary-container shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Room</span>
          </button>
        </div>
      </section>

      {/* Status Filter Pills */}
      <section className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {['ALL', 'AVAILABLE', 'PARTIALLY_OCCUPIED', 'FULL', 'MAINTENANCE'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all ${
              selectedStatus === st
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-lowest text-secondary hover:text-on-surface'
            }`}
          >
            {st === 'ALL'
              ? 'All Rooms'
              : st === 'PARTIALLY_OCCUPIED'
              ? 'Partially Occupied'
              : st.charAt(0) + st.slice(1).toLowerCase()}
          </button>
        ))}
      </section>

      {/* Room Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {loading ? (
          <div className="col-span-full p-8 text-center text-secondary flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span>Loading rooms inventory...</span>
          </div>
        ) : rooms.length === 0 ? (
          <div className="col-span-full p-8 bg-surface-container-lowest rounded-xl text-center text-secondary border border-slate-200">
            No rooms match your filter criteria.
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md border border-slate-200 flex flex-col justify-between gap-space-sm hover:shadow-md transition-shadow"
            >
              {/* Room Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {room.roomNumber}
                    </h3>
                    <Badge status={room.status}>{room.status}</Badge>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                    {room.wing} • Floor {room.floor} • {room.roomType}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-title-md text-title-md font-bold text-primary block">
                    {formatCurrency(room.monthlyRent)}
                  </span>
                  <span className="text-[11px] text-secondary uppercase font-semibold">per month</span>
                </div>
              </div>

              {/* Occupancy Indicator Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-secondary">
                    {room.occupiedBeds} of {room.capacity} Beds Occupied
                  </span>
                  <span className="text-primary font-bold">
                    {Math.round((room.occupiedBeds / room.capacity) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      room.occupiedBeds >= room.capacity
                        ? 'bg-red-500'
                        : room.occupiedBeds > 0
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(room.occupiedBeds / room.capacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Occupants Roster List */}
              <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-1.5">
                {room.occupants && room.occupants.length > 0 ? (
                  room.occupants.map((occ) => (
                    <div key={occ.id} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-[10px]">
                          {occ.bedNumber?.charAt(occ.bedNumber.length - 1) || 'A'}
                        </span>
                        <span className="font-semibold text-on-surface">{occ.fullName}</span>
                        <span className="text-secondary font-mono text-[11px]">({occ.rollNumber})</span>
                      </div>
                      <button
                        onClick={() => handleRemoveStudent(room.id, occ.id)}
                        className="text-secondary hover:text-error text-xs"
                        title="Unassign Student"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_remove</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-secondary italic py-1 text-center">
                    All {room.capacity} beds currently vacant
                  </span>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                <span className="text-xs text-secondary font-medium">
                  {room.capacity - room.occupiedBeds} slot(s) available
                </span>
                {room.occupiedBeds < room.capacity && room.status !== 'MAINTENANCE' && (
                  <button
                    onClick={() => handleOpenAssign(room)}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Assign Bed</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Bed Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Resident to ${targetRoom?.roomNumber || 'Room'}`}
      >
        <form onSubmit={handleAssignBed} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
            <select
              required
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">-- Choose Resident --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.rollNumber} - Current: {s.roomNumber || 'Unassigned'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bed Slot</label>
            <input
              type="text"
              required
              value={targetBedNumber}
              onChange={(e) => setTargetBedNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors mt-2"
          >
            Confirm Bed Allocation
          </button>
        </form>
      </Modal>

      {/* Create Room Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Room Unit">
        <form onSubmit={handleCreateRoom} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room Number</label>
              <input
                type="text"
                required
                placeholder="e.g. Room 208"
                value={newRoomData.roomNumber}
                onChange={(e) => setNewRoomData({ ...newRoomData, roomNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wing</label>
              <select
                value={newRoomData.wing}
                onChange={(e) => setNewRoomData({ ...newRoomData, wing: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Wing A">Wing A</option>
                <option value="Wing B">Wing B</option>
                <option value="Wing C">Wing C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Floor</label>
              <input
                type="number"
                min={1}
                max={10}
                required
                value={newRoomData.floor}
                onChange={(e) => setNewRoomData({ ...newRoomData, floor: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room Type</label>
              <select
                value={newRoomData.roomType}
                onChange={(e) => setNewRoomData({ ...newRoomData, roomType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Single AC">Single AC</option>
                <option value="Double Deluxe">Double Deluxe</option>
                <option value="Triple AC">Triple AC</option>
                <option value="Standard Non-AC">Standard Non-AC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity (Beds)</label>
              <input
                type="number"
                min={1}
                max={6}
                required
                value={newRoomData.capacity}
                onChange={(e) => setNewRoomData({ ...newRoomData, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Rent ($)</label>
              <input
                type="number"
                min={100}
                required
                value={newRoomData.monthlyRent}
                onChange={(e) => setNewRoomData({ ...newRoomData, monthlyRent: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors mt-2"
          >
            Create Room Record
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default RoomAllocation;
