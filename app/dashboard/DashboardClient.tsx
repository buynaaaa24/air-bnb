'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeListing, SafeUser } from "../types";
import Heading from "../components/Heading";
import Container from "../components/Container";

interface DashboardClientProps {
  listings: SafeListing[];
  currentUser: SafeUser | null;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  listings,
  currentUser,
}) => {
  const router = useRouter();
  const pdfRef = useRef<HTMLDivElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handlePropertyClick = (id: string) => {
    router.push(`/listings/${id}`);
  };

  const onCancel = useCallback(
    (id: string) => {
      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success("Өмч устгагдлаа");
          router.refresh();
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            toast.error("Захиалгатай тул устгах боломжгүй!");
          } else {
            toast.error("Алдаа гарлаа");
          }
        });
    },
    [router]
  );

  const startEditing = (listing: SafeListing) => {
    setEditingId(listing.id);
    setEditTitle(listing.title || "");
    setEditDescription(listing.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = async (id: string) => {
    try {
      await axios.put(`/api/listings/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      toast.success("Өмч амжилттай засагдлаа");
      setEditingId(null);
      router.refresh();
    } catch (error) {
      toast.error("Засахад алдаа гарлаа");
    }
  };

  const ownedListings = listings.filter(
    (listing) => listing.userId === currentUser?.id
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("mn-MN", {
      style: "currency",
      currency: "MNT",
    }).format(price);
  };

  return (
    <Container>
      <div className="mt-14 max-w-7xl mx-auto px-6">
        <Heading
          title="Миний хөрөнгүүд"
          subtitle="Та өөрийн оруулсан үл хөдлөх хөрөнгүүдээ эндээс удирдана"
        />

        <div
          ref={pdfRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "8.5in",
            padding: "0.5in",
            backgroundColor: "white",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>
            Миний хөрөнгүүд (PDF)
          </h2>
          {ownedListings.length === 0 ? (
            <p>Таны оруулсан үл хөдлөх хөрөнгө олдсонгүй.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr>
                  {["Байршил", "Ангилал", "Гарчиг", "Тайлбар", "Үнэ"].map(
                    (header) => (
                      <th
                        key={header}
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: header === "Үнэ" ? "right" : "left",
                          backgroundColor: "#f3f3f3",
                          fontWeight: 600,
                        }}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {ownedListings.map((listing) => (
                  <tr key={listing.id} style={{ cursor: "default" }}>
                    <td style={{ border: "1px solid #000", padding: 8 }}>
                      {listing.locationValue}
                    </td>
                    <td style={{ border: "1px solid #000", padding: 8 }}>
                      {listing.category}
                    </td>
                    <td style={{ border: "1px solid #000", padding: 8 }}>
                      {listing.title}
                    </td>
                    <td style={{ border: "1px solid #000", padding: 8 }}>
                      {listing.description}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: 8,
                        textAlign: "right",
                      }}
                    >
                      {formatPrice(listing.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {ownedListings.length === 0 ? (
          <p className="mt-10 text-center text-gray-400 text-lg italic">
            Таны оруулсан үл хөдлөх хөрөнгө олдсонгүй.
          </p>
        ) : (
          <div className="overflow-x-auto mt-10 shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold">Байршил</th>
                  <th className="px-5 py-3 text-left font-semibold capitalize">Ангилал</th>
                  <th className="px-5 py-3 text-left font-semibold">Гарчиг</th>
                  <th className="px-5 py-3 text-left font-semibold">Тайлбар</th>
                  <th className="px-5 py-3 text-right font-semibold">Үнэ</th>
                  <th className="px-5 py-3 text-center font-semibold">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {ownedListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="bg-white hover:bg-indigo-50 cursor-pointer transition"
                    onClick={() => handlePropertyClick(listing.id)}
                  >
                    <td className="border-b border-gray-200 px-5 py-3">{listing.locationValue}</td>
                    <td className="border-b border-gray-200 px-5 py-3 capitalize">{listing.category}</td>

                    <td className="border-b border-gray-200 px-5 py-3">
                      {editingId === listing.id ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        listing.title
                      )}
                    </td>

                    <td className="border-b border-gray-200 px-5 py-3">
                      {editingId === listing.id ? (
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="border border-gray-300 rounded p-2 w-full h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        listing.description
                      )}
                    </td>

                    <td className="border-b border-gray-200 px-5 py-3 text-right font-medium">
                      {formatPrice(listing.price)}
                    </td>
                    <td
  className="border border-gray-300 px-4 py-2 text-center"
  onClick={(e) => e.stopPropagation()}
>
  {editingId === listing.id ? (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => saveEditing(listing.id)}
        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
      >
        Хадгалах
      </button>
      <button
        onClick={cancelEditing}
        className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
      >
        Болих
      </button>
    </div>
  ) : (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => onCancel(listing.id)}
        className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
      >
        Устгах
      </button>
      <button
        onClick={() => startEditing(listing)}
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
      >
        Засах
      </button>
    </div>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
};

export default DashboardClient;
